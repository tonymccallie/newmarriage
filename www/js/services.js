angular.module('greyback.services', [])

.service('UserService', function ($q, $http, $location, $localStorage, $state) {
	var self = this;
	self.user = null;

	self.local = function ($category) {
		console.log('UserService.local');
		var deferred = $q.defer();
		var localUser = $localStorage.getObject('NewMarriageUser');
		deferred.resolve(localUser);
		return deferred.promise;
	}

	self.init = function () {
		console.log('UserService.init');
		var deferred = $q.defer();
		self.local().then(function (storedUser) {
			if (typeof storedUser.User === 'undefined') {
				console.log('UserService.init: need to login');
				//HIDE FOR DEV
				$state.go('login');
				deferred.resolve(self.user);
			} else {
				console.log('UserService.init: use local');
				self.user = storedUser;
				deferred.resolve(self.user);
			}
		});

		//		$location.path('/tab/home');
		//		$location.replace();

		return deferred.promise;
	}

	self.loginUser = function (user) {
		console.log('UserService.loginUser');
		var promise = $http.post(DOMAIN + '/ajax/users/login', user)
			.success(function (response, status, headers, config) {
			switch (response.status) {
			case 'SUCCESS':
				response.data.data = $localStorage.toObj(response.data.User.json);
				self.updateUser(response.data).then(function () {
					$state.go('menu.tabs.home');
				});
				break;
			case 'MESSAGE':
				alert(response.data);
				$state.go('login');
				break;
			default:
				alert('there was a server error for Messages');
				console.log(response);
				break;
			}
		})
			.error(function (response, status, headers, config) {
			console.log(['error', status, headers, config]);
		});
		return promise;
	}

	self.saveFacebook = function (fbuser) {
		console.log('UserService.saveFacebook')
		var promise = $http.post(DOMAIN + '/ajax/users/facebook', fbuser)
			.success(function (response, status, headers, config) {

			if (response.status === 'SUCCESS') {
				self.updateUser(response.data).then(function () {
					$state.go('menu.tabs.home');
				});
			} else {
				alert('there was a server error for Messages');
				console.log(response);
			}
		})
			.error(function (response, status, headers, config) {
			console.log(['error', status, headers, config]);
		});
		return promise;
	}

	self.checkUser = function () {
		console.log('UserService.checkUser');
		var deferred = $q.defer();
		if (!self.user) {
			console.log('UserService.checkUser: no user');
			self.init().then(function (initUser) {
				deferred.resolve(self.user);
			});
		} else {
			console.log('UserService.checkUser: had user');
			deferred.resolve(self.user);
		}
		return deferred.promise;
	}

	self.createUser = function (user) {
		console.log('UserService.createUser');
		var promise = $http.post(DOMAIN + '/ajax/users/register', user)
			.success(function (response, status, headers, config) {
			switch (response.status) {
			case 'SUCCESS':
				self.updateUser(response.data).then(function () {
					$state.go('menu.tabs.home');
				});
				break;
			case 'MESSAGE':
				alert(response.data);
				$state.go('login');
				break;
			default:
				alert('there was a server error for Messages');
				console.log(response);
				break;
			}
		})
			.error(function (response, status, headers, config) {
			console.log(['error', status, headers, config]);
		});
		return promise;
	}

	self.updateUser = function (user) {
		console.log('UserService.updateUser');
		var deferred = $q.defer();
		self.user = user;
		$localStorage.setObject('NewMarriageUser', self.user);
		deferred.resolve(self.user);
		return deferred.promise;
	}

	self.syncUser = function (user) {
		console.log('UserService.syncUser');

		var promise = $http.post(DOMAIN + '/ajax/users/update', user)
			.success(function (response, status, headers, config) {
			switch (response.status) {
			case 'SUCCESS':
				self.updateUser(response.data);
				break;
			case 'MESSAGE':
				alert(response.data);
				break;
			default:
				alert('there was a server error for Messages');
				console.log(response);
				break;
			}
		})
			.error(function (response, status, headers, config) {
			console.log(['error', status, headers, config]);
		});

		return promise;
	}
	
	self.email = function(user, template) {
		console.log('UserService.email');

		var promise = $http.post(DOMAIN + '/ajax/users/email/'+template, user)
			.success(function (response, status, headers, config) {
			switch (response.status) {
			case 'SUCCESS':
				self.updateUser(response.data);
				break;
			case 'MESSAGE':
				alert(response.data);
				break;
			default:
				alert('there was a server error for Messages');
				console.log(response);
				break;
			}
		})
			.error(function (response, status, headers, config) {
			console.log(['error', status, headers, config]);
		});

		return promise;
	}

	self.logout = function () {
		console.log('UserService.logout');
		self.user = null;
		$localStorage.remove('NewMarriageUser');
		$state.go('login');
	}

	self.exercise = function (exercise) {
		console.log('UserService.exercise');
		var deferred = $q.defer();
		if (self.user) {
			console.log(self.user.data.exercises[exercise]);
			deferred.resolve(self.user.data.exercises[exercise]);
		} else {
			$state.go('menu.tabs.teamwork');
			deferred.resolve({});
		}


		return deferred.promise;
	}
})

.service('PtrService', function ($timeout, $ionicScrollDelegate) {
	/**
	 * Trigger the pull-to-refresh on a specific scroll view delegate handle.
	 * @param {string} delegateHandle - The `delegate-handle` assigned to the `ion-content` in the view.
	 */
	this.triggerPtr = function (delegateHandle) {

		$timeout(function () {

			var scrollView = $ionicScrollDelegate.$getByHandle(delegateHandle).getScrollView();

			if (!scrollView) return;

			scrollView.__publish(
				scrollView.__scrollLeft, -scrollView.__refreshHeight,
				scrollView.__zoomLevel, true);

			var d = new Date();

			scrollView.refreshStartTime = d.getTime();

			scrollView.__refreshActive = true;
			scrollView.__refreshHidden = false;
			if (scrollView.__refreshShow) {
				scrollView.__refreshShow();
			}
			if (scrollView.__refreshActivate) {
				scrollView.__refreshActivate();
			}
			if (scrollView.__refreshStart) {
				scrollView.__refreshStart();
			}

		});

	}
})

.service('ListService', function () {
	var self = this;

	self.painList = [
		'UNLOVED', 'UNWORTHY', 'INSIGNIFICANT', 'ALONE', 'WORTHLESS',
		'DEVALUED', 'DEFECTIVE', 'INADEQUATE', 'REJECTED', 'UNACCEPTABLE',
		'HOPELESS', 'UNWANTED', 'ABANDONED', 'OUT OF CONTROL', 'DISCOURAGED',
		'UNSAFE', 'INSECURE', 'FEARFUL', 'VULNERABLE', 'CONTROLLED',
		'POWERLESS', 'UNKOWN', 'BETRAYED', 'INVALIDATED', 'UNABLE TO MEASURE UP',
	];

	self.copeList = [
		'BLAMING', 'DEPRESSED', 'CONTROLLING', 'HIGH/DRUNK', 'ANGRY', 'NEGATIVE',
		'PERFECTIONISTIC', 'NUMBED OUT', 'SARCASTIC', 'ISOLATED', 'PERFORMANCE-DRIVEN', 'IRRESPONSIBLE',
		'ARROGANT', 'INCONSOLABLE', 'INTELLECTUALIZING', 'IMPULSIVE', 'THREATENING', 'CATASTROPHIZING',
		'DEMANDING', 'OUT OF CONTROL', 'RETALIATORY', 'WHINY/NEEDY', 'CRITICAL', 'SELFISH',
		'UNRELIABLE', 'MANIPULATIVE', 'WITHDRAWING TO PUNISH', 'WITHDRAWING TO POUT', 'WITHDRAWING TO AVOID',
	];

	self.truthList = [
		'LOVED', 'KNOWN', 'ACCEPTED', 'ABLE TO CONTROL SELF', 'EMPOWERED',
		'APPRECIATED', 'ENCOURAGED', 'PRICELESS', 'FULL OF WORTH', 'FULL OF PROMISE',
		'WANTED', 'VALUABLE', 'ADEQUATE', 'CONNECTED', 'VALUED',
		'TREASURED', 'CELEBRATED', 'SIGNIFICANT', 'SAFE'
	];

	self.actionList = [
		'ACCEPTING', 'ABLE TO PERSIST', 'NON-DEFENSIVE', 'KIND', 'SELF-CONTROLLED', 'SETTLED',
		'BURTURING', 'RESPONSIBLE', 'VULNERABLE', 'GENTLE', 'HOPEFUL', 'SEEKING GOOD',
		'SUPPORTIVE', 'TRUSTWORTHY', 'CARING', 'LISTENING', 'RESPECTFUL', 'RELIABLY-CONNECTING',
		'ENCOURAGING', 'LOVING', 'ENGAGING', 'MERCIFUL', 'OPEN', 'HONEST',
		'GIVING', 'EMPATHETIC', 'PEACEFUL', 'RELIABLE', 'INTIMATE', 'HUMBLE',
		'SOBER', 'INCLUSIVE', 'RELAXED', 'POSITIVE'
	];

	self.selfcareQuiz = {
		physical: {
			1: [
				"Eat Poorly (too much, too little, or junk food)",
				"Eats well sometimes, but generally not nutritionally minded",
				"Eats consistently healthfully"
			],
			2: [
				"Sleep poorly,(too much, too little, irregular) ",
				"Gets some rest ",
				"Well rested"
			],
			3: [
				"Out of shape, no exercise ",
				"Gets occasional exercise ",
				"In great physical shape, exercises regularly"
			],
			4: [
				"Never drinks water",
				"Occasionally drinks water ",
				"Drinks 6-8 cups of water daily"
			]
		},
		mental: {
			1: [
				"Disinterested in learning new things ",
				"Sometimes gets interested in learning new things ",
				"Always seeking to learn new things "
			],
			2: [
				"Generally bored with life ",
				"Occasionally exchanges ideas with others ",
				"Regularly exchanges ideas with others "
			],
			3: [
				"Doesn’t seek to understand more deeply ",
				"Willing to grow in wisdom and knowledge ",
				"Challenges self to constantly grow in wisdom and knowledge "
			],
			4: [
				"Overwhelmed by negative thoughts",
				"Try to challenge my thoughts",
				"Consistently replacing negative thoughts"
			]
		},
		emotional: {
			1: [
				"Judges feelings as wrong or bad",
				"Sometimes judges emotions as wrong or bad",
				"Accepts emotions as information worth considering"
			],
			2: [
				"Stuffs emotions (ignores or avoids)",
				"Sometimes stuffs or ignores feelings",
				"Accurately identify and express emotions"
			],
			3: [
				"Wallowing (often overcome or paralyzed by emotions)",
				"Sometimes overwhelmed by emotions",
				"Values emotions in proper perspective"
			],
			4: [
				"Avoid vulnerability in relationships",
				"Occasionally opens up and shares with friends",
				"Consistently transparent and connected with friends"
			]
		},
		spiritual: {
			1: [
				"Never reads scripture",
				"Reads scripture occasionally, but rarely studies the scripture",
				"Consistent bible reading and study"
			],
			2: [
				"Rarely or never prays",
				"Prays occasionally or just at meals",
				"Consistently prays by yourself and with others"
			],
			3: [
				"No meaningful connection to God",
				"Consults God on BIG decisions or when in crisis",
				"Looks to the scripture for wisdom and spiritual guiding"
			],
			4: [
				"No conscious fellowship with other believers",
				"Attends church occasionally",
				"Active involvement with Small Group and church"
			]
		}
	};
});