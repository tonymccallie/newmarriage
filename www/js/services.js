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
				//$state.go('login');
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
		var promise = $http.post(DOMAIN + '/users/ajax_login', user)
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

	self.saveFacebook = function (fbuser) {
		console.log('UserService.saveFacebook')
		var promise = $http.post(DOMAIN + '/users/ajax_facebook', fbuser)
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
		var promise = $http.post(DOMAIN + '/users/ajax_register', user)
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

	self.logout = function () {
		console.log('UserService.logout');
		self.user = null;
		$localStorage.remove('User');
		$state.go('login');
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

	self.steps = [
		{
			name: "How I Feel",
			values: [
				"Unloved",
				"Unable to Measure Up",
				"Unappreciated",
				"Hopeless"
			]
		},
		{
			name: "My Truths",
			values: [
				"Can Control Self",
				"Empowered",
				"Encouraged",
				"Celebrated"
			]
		},
		{
			name: "How I Cope",
			values: [
				"Blame Others",
				"Withdraw to Defend",
				"Catastrophizing",
				"Avoidant"
			]
		},
		{
			name: "My Actions",
			values: [
				"Communicate Care",
				"Reliably Connected",
				"Seeking Good",
				"Non Defensive"
			]
		}
	]
});