angular.module('greyback.controllers', [])

.controller('AppController', function ($scope, $sce, $ionicDeploy, $ionicActionSheet, $location, $ionicPlatform, $state, $ionicSideMenuDelegate, UserService, user) {
	console.log('AppController');
	//app wide variables
	$scope.currentDate = new Date();
	$scope.DOMAIN = DOMAIN;
	$scope.imageDir = DOMAIN + '/img/thumb/';
	$scope.logs = [];
	$scope.user = user;
	$scope.log = function (obj) {
		$scope.logs.push(moment().format('h:mm:ss') + ': ' + obj);
	}

	$ionicPlatform.ready(function () {
		$scope.log('Ionic Deploy: Checking for updates');
		//		$ionicDeploy.check().then(function (hasUpdate) {
		//			$scope.log('Ionic Deploy: Update available: ' + hasUpdate);
		//			$scope.hasUpdate = hasUpdate;
		//			if(hasUpdate) {
		//				$ionicActionSheet.show({
		//					titleText: 'There is an update available',
		//					buttons: [
		//						{ text: 'Update Now' }
		//					],
		//					buttonClicked: function(index) {
		//						$location.path('/menu/tabs/settings');
		//					},
		//					cancelText: 'Later',
		//					cancel: function() {
		//						return true;
		//					}
		//				});
		//			}
		//		}, function (err) {
		//			$scope.log('Ionic Deploy: Unable to check for updates', err);
		//		});

	});

	$scope.trust = function (snippet) {
		return $sce.trustAsHtml(snippet);
	};

	$scope.updateTextArea = function (textarea) {
		var element = document.getElementById(textarea);
		element.style.height = element.scrollHeight + "px";
	}

	$scope.logout = function () {
		$scope.user = {};
		UserService.logout();
	}
})

.controller('LoginController', function ($scope, ngFB, UserService) {
	console.log('LoginController');
	$scope.loginUser = {};

	$scope.login = function (form) {
		console.log(['LoginController.login', $scope.loginUser]);
		if (form.$valid) {
			UserService.loginUser($scope.loginUser).then(function (data) {

			});
		}
	}

	$scope.fblogin = function () {
		console.log('LoginController.fblogin');
		ngFB.login({
			scope: 'email,public_profile'
		}).then(function (response) {
			if (response.status === 'connected') {
				console.log(['Facebook login succeeded', response]);
				ngFB.api({
					path: '/me',
					params: {
						fields: 'id,email,first_name,last_name'
					}
				}).then(function (user) {
					UserService.saveFacebook(user).then(function (user) {
						$scope.user = user;
					});
					//MAKE AN APP USER
					//$scope.user = user;
				}, function (error) {
					alert('Facebook error: ' + error.error_description);
				});
			} else {
				alert('Facebook login failed');
			}
		});
	}

	$scope.fblogout = function () {
		console.log('fblogout');
		ngFB.logout().then(function (response) {
			console.log('logout');
		});
	}
})

.controller('SignupController', function ($scope, UserService) {
	console.log('SignupController');
	$scope.signupUser = {};

	$scope.signup = function (form) {
		console.log(['SignupController.signup', $scope.signupUser]);
		if (form.$valid) {
			UserService.createUser($scope.signupUser).then(function (data) {

			});
		}
	}
})

.controller('ForgotController', function ($scope, ngFB) {
	console.log('ForgotController');
})

.controller('HomeController', function ($scope, $q, $ionicModal, $timeout, $ionicSlideBoxDelegate, ImgCache, PtrService, ngFB, user) {
	console.log('HomeController');
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	// Form data for the login modal
	$scope.loginData = {};

	//FACEBOOK API REFERENCE
	//	ngFB.api({
	//		path: '/me',
	//		params: {
	//			fields: 'id,name'
	//		}
	//	}).then(function (user) {
	//		$scope.user = user;
	//	}, function (error) {
	//		alert('Facebook error: ' + error.error_description);
	//	});

	// Create the login modal that we will use later
	//	$ionicModal.fromTemplateUrl('templates/login.html', {
	//		scope: $scope
	//	}).then(function (modal) {
	//		$scope.modal = modal;
	//	});

	// Triggered in the login modal to close it
	$scope.closeLogin = function () {
		$scope.modal.hide();
	};

	// Open the login modal
	$scope.login = function () {
		$scope.modal.show();
	};

	// Perform the login action when the user submits the login form
	$scope.doLogin = function () {
		$scope.log('Doing login', $scope.loginData);

		// Simulate a login delay. Remove this and replace with your login
		// code if using a login system
		$timeout(function () {
			$scope.closeLogin();
		}, 1000);
	};

	$scope.update = function () {
		console.log('HomeController.update');
		//		var headersPromise = NewsService.update('headers');
		//		var newsPromise = NewsService.update('articles');
		//
		//
		//		$q.all([headersPromise, newsPromise]).then(function (data) {
		//			console.log(data);
		//			$scope.headers = data[0];
		//			$scope.articles = data[1];
		//			$scope.$broadcast('scroll.refreshComplete');
		//			setTimeout(function () {
		//				$ionicSlideBoxDelegate.update();
		//			}, 0);
		//		});
	}

	$scope.$on("$ionicView.loaded", function () {
		//console.log("View loaded! Triggering PTR");
		//PtrService.triggerPtr('home_pull');
	});
})

.controller('UserController', function ($scope, $q, $ionicModal, $timeout, $ionicHistory, $ionicLoading, $state, ImgCache, PtrService, ngFB, user, UserService, ListService, UtilService) {
	console.log('UserController');
	$scope.link_code = "";
	$scope.user = user;
	//$scope.user.data = {};

	$scope.$on('$ionicView.enter', function (e) {
		console.log('State: ' + $state.current.name);
		switch ($state.current.name) {
		case 'menu.tabs.pain_my_cycle':
			if ((typeof $scope.user.data != 'undefined') && (typeof $scope.user.data.usness != 'undefined') && (typeof $scope.user.data.usness.pains != 'undefined')) {
				$scope.painCount = UtilService.countBool($scope.user.data.usness.pains);
			}
			if ((typeof $scope.user.data != 'undefined') && (typeof $scope.user.data.usness != 'undefined') && (typeof $scope.user.data.usness.copes != 'undefined')) {
				$scope.copeCount = UtilService.countBool($scope.user.data.usness.copes);
			}
			break;
		case 'menu.tabs.pain_spouse_cycle':
			if ((typeof $scope.user.data != 'undefined') && (typeof $scope.user.data.usness != 'undefined') && (typeof $scope.user.data.usness.spouse_pains != 'undefined')) {
				$scope.painCountSpouse = UtilService.countBool($scope.user.data.usness.spouse_pains);
			}
			if ((typeof $scope.user.data != 'undefined') && (typeof $scope.user.data.usness != 'undefined') && (typeof $scope.user.data.usness.spouse_copes != 'undefined')) {
				$scope.copeCountSpouse = UtilService.countBool($scope.user.data.usness.spouse_copes);
			}
			break;
		case 'menu.tabs.peace_my_cycle':
			if ((typeof $scope.user.data != 'undefined') && (typeof $scope.user.data.usness != 'undefined') && (typeof $scope.user.data.usness.truths != 'undefined')) {
				$scope.truthCount = UtilService.countBool($scope.user.data.usness.truths);
			}
			if ((typeof $scope.user.data != 'undefined') && (typeof $scope.user.data.usness != 'undefined') && (typeof $scope.user.data.usness.actions != 'undefined')) {
				$scope.actionCount = UtilService.countBool($scope.user.data.usness.actions);
			}
			break;
		case 'menu.tabs.peace_spouse_cycle':
			if ((typeof $scope.user.data != 'undefined') && (typeof $scope.user.data.usness != 'undefined') && (typeof $scope.user.data.usness.spouse_truths != 'undefined')) {
				$scope.truthCountSpouse = UtilService.countBool($scope.user.data.usness.spouse_truths);
			}
			if ((typeof $scope.user.data != 'undefined') && (typeof $scope.user.data.usness != 'undefined') && (typeof $scope.user.data.usness.spouse_actions != 'undefined')) {
				$scope.actionCountSpouse = UtilService.countBool($scope.user.data.usness.spouse_actions);
			}
			break;
		}
	});

	$scope.process = function (next, form) {
		var boolPass = true;
		if (form == 'usnessGiftsForm' && $scope.giftCount < 1) {
			boolPass = false;
			alert('You much choose at least one gift.');
		}

		if (form == 'pain_my_cycle' && $scope.painCount < 1) {
			boolPass = false;
			alert('You much choose at least one feeling.');
		}

		if (form == 'pain_my_cycle' && $scope.copeCount < 1) {
			boolPass = false;
			alert('You much choose at least one cope.');
		}

		if (form == 'pain_spouse_cycle' && $scope.painCountSpouse < 1) {
			boolPass = false;
			alert('You much choose at least one feeling.');
		}

		if (form == 'pain_spouse_cycle' && $scope.copeCountSpouse < 1) {
			boolPass = false;
			alert('You much choose at least one cope.');
		}

		if (form == 'peace_my_cycle' && $scope.truthCount < 1) {
			boolPass = false;
			alert('You much choose at least one truth.');
		}

		if (form == 'peace_my_cycle' && $scope.actionCount < 1) {
			boolPass = false;
			alert('You much choose at least one action.');
		}

		if (boolPass) {
			$scope.user.data[form] = true;
			if (form == 'cyclesPeaceResponseForm') {
				$scope.user.data.peace = true;
			}
			if (form == 'cyclesPainCopesForm') {
				$scope.user.data.pain = true;
			}
			$ionicLoading.show({
				template: 'Syncing Results<br /><ion-spinner></ion-spinner>'
			});
			UserService.syncUser($scope.user).then(function (data) {
				$ionicLoading.hide();
				console.log($scope.user);
			});
			$state.go(next);
		}
	}

	$scope.painList = ListService.painList;

	$scope.painCount = 0;

	$scope.checkPains = function (item) {
		if (item) {
			$scope.painCount++;
		} else {
			$scope.painCount--;
		}
	}

	$scope.painCountSpouse = 0;

	$scope.checkPainsSpouse = function (item) {
		if (item) {
			$scope.painCountSpouse++;
		} else {
			$scope.painCountSpouse--;
		}
	}

	$scope.copeList = ListService.copeList;

	$scope.copeCount = 0;

	$scope.checkCopes = function (item) {
		if (item) {
			$scope.copeCount++;
		} else {
			$scope.copeCount--;
		}
	}

	$scope.copeCountSpouse = 0;

	$scope.checkCopesSpouse = function (item) {
		if (item) {
			$scope.copeCountSpouse++;
		} else {
			$scope.copeCountSpouse--;
		}
	}

	$scope.truthList = ListService.truthList;

	$scope.truthCount = 0;

	$scope.checkTruths = function (item) {
		if (item) {
			$scope.truthCount++;
		} else {
			$scope.truthCount--;
		}
	}

	$scope.truthCountSpouse = 0;

	$scope.checkTruthsSpouse = function (item) {
		if (item) {
			$scope.truthCountSpouse++;
		} else {
			$scope.truthCountSpouse--;
		}
	}

	$scope.actionList = ListService.actionList;

	$scope.actionCount = 0;

	$scope.checkActions = function (item) {
		if (item) {
			$scope.actionCount++;
		} else {
			$scope.actionCount--;
		}
	}

	$scope.actionCountSpouse = 0;

	$scope.checkActionsSpouse = function (item) {
		if (item) {
			$scope.actionCountSpouse++;
		} else {
			$scope.actionCountSpouse--;
		}
	}

	$scope.steps = ListService.steps;

	$scope.clearConflict = function () {
		$scope.user.data.conflict_exercise = "";
	}
})

.controller('ExerciseController', function ($scope, $q, $ionicModal, $timeout, $ionicHistory, $state, ImgCache, PtrService, ngFB, user, exercise, UserService) {
	console.log('ExerciseController');
	$scope.exercise = exercise;

	console.log(typeof $scope.exercise.index);

	if (!typeof $scope.exercise.index == 'undefined') {
		console.log('check index');
		$scope.exercise.index = $scope.user.data.exercises.indexOf($scope.exercise)
	}

	console.log($scope.exercise);

	$scope.save = function (form) {
		console.log('ExcerciseController.save');
		if (typeof $scope.user.data == 'undefined') {
			$scope.user.data = {};
		}

		if (typeof $scope.user.data.exercises == 'undefined') {
			$scope.user.data.exercises = [];
		}

		if (typeof $scope.exercise.index == 'undefined') {
			$scope.user.data.exercises.push($scope.exercise);
			$scope.exercise.index = $scope.user.data.exercises.length - 1;
		}

		$scope.user.data.exercises[$scope.exercise.index] = $scope.exercise;

		console.log($scope.user.data.exercises);

		UserService.updateUser($scope.user);
		$state.go('menu.tabs.teamwork_exercise_view', {
			exercise: $scope.exercise.index
		});
		$scope.exercise = {};
	}

	$scope.remove = function () {
		console.log('ExcerciseController.remove');
		console.log($scope.exercise.index);
		$scope.user.data.exercises.splice($scope.exercise.index, 1);
		UserService.updateUser($scope.user);
		$state.go('menu.tabs.teamwork_exercise_results');
	}
})

.controller('QuizController', function ($scope, $q, $ionicModal, $timeout, $ionicHistory, $state, ImgCache, PtrService, ngFB, user, ListService, UserService, UtilService) {
	console.log('QuizController');

	$scope.selfcareQuiz = ListService.selfcareQuiz;
	
	$scope.start = function() {
		$scope.user.data.quiz = {};
		UserService.updateUser($scope.user).then(function() {
			$state.go('menu.tabs.growth_quiz_physical');
		});
	}
	
	$scope.save = function() {
		UserService.updateUser($scope.user);
	}
	
	$scope.email = function() {
		UserService.email($scope.user).then(function(tmpObj) {
			alert('The results have been emailed.');
		});
	}

	$scope.quiz = function (step) {
		console.log('QuizController.quiz');
		var answers = {};
		var target = "";
		switch(step) {
			case 'physical':
				answers = $scope.user.data.quiz.physical_question;
				target = "menu.tabs.growth_quiz_physical_score";
				break;
			case 'mental':
				answers = $scope.user.data.quiz.mental_question;
				target = "menu.tabs.growth_quiz_mental_score";
				break;
			case 'spiritual':
				answers = $scope.user.data.quiz.spiritual_question;
				target = "menu.tabs.growth_quiz_spiritual_score";
				break;
			case 'emotional':
				answers = $scope.user.data.quiz.emotional_question;
				target = "menu.tabs.growth_quiz_emotional_score";
				$scope.user.data.quiz.taken = moment().format('MMM Do');
				break;
		}
		
		if(UtilService.countBool(answers) < 4) {
			alert('Please answer all the questions.');
		} else {
			$scope.user.data.quiz[step] = UtilService.sumObj(answers) + 1;
			UserService.updateUser($scope.user).then(function() {
				$state.go(target);
			});
		}
	}
})