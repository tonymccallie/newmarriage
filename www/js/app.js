var DOMAIN = 'http://newmarriage.server1.greyback.net/'
//DEVELOPMENT
var devtest = /localhost/.test(window.location.hostname);
if (devtest) {
	DOMAIN = 'http://localhost/newmarriage_server';
	isMobile = false;
}
devtest = /threeleaf/.test(window.location.hostname);
if (devtest) {
	DOMAIN = 'http://office.threeleaf.net:8080/newmarriage_server';
	isMobile = false;
}

//TEMP
//var DOMAIN = 'http://office.threeleaf.net:8080/marriagestrong_server';

var onclickFix = function (html) {
	html = html.replace(/href=\"\//ig, 'href="http://www.intensives.com/');
	html = html.replace(/src=\"\//ig, 'src="http://www.intensives.com/');
	return html.replace(/href=\"(.+?)\"/gi, 'onclick="window.open(\'$1\',\'_system\',\'location=yes\');"');
}

angular.module('greyback', ['ionic', 'ngCordova', 'ImgCache', 'ionic.service.core', 'ionic.service.push', 'ionic.service.deploy', 'ionic.service.analytics', 'ionic-datepicker', 'ngOpenFB', 'ngMessages', 'greyback.controllers', 'greyback.services', 'greyback.utils'])

.run(function ($rootScope, $ionicPlatform, $ionicAnalytics, $cordovaSplashscreen, ImgCache, ngFB) {
	console.log('App.run');
	ngFB.init({
		appId: '1640442856222427',
		oauthRedirectURL: DOMAIN + '/users/oauthlogin',
		logoutRedirectURL: DOMAIN + '/users/oauthlogout',
	});
	$ionicPlatform.ready(function () {
		console.log('platform.ready');
		$ionicAnalytics.register();
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			$cordovaSplashscreen.hide();
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			$cordovaStatusBar.style(2);
		}
		ImgCache.$init();
	});
})

.config(function ($ionicAppProvider, ImgCacheProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	// Identify app
	$ionicAppProvider.identify({
		// The App ID (from apps.ionic.io) for the server
		app_id: 'b5459458',
		// The public API key all services will use for this app
		api_key: '3dba898087ab6ad516d3bd91dc801fba79ddaf871b12ca36',
		// Set the app to use development pushes
		dev_push: false
	});

	ImgCacheProvider.manualInit = true;

	$ionicConfigProvider.backButton.previousTitleText(false).text('<i class="threeleaf">5</i>').icon('');
	$ionicConfigProvider.tabs.position('bottom');

	$stateProvider

	.state('menu', {
		url: "/menu",
		abstract: true,
		templateUrl: "templates/system/menu.html",
		controller: 'AppController',
		resolve: {
			user: function (UserService) {
				console.log('Config.state.menu.resolve.user');
				return UserService.checkUser();
			}
		}
	})

	.state('menu.tabs', {
		url: "/tabs",
		abstract: true,
		views: {
			'menuContent': {
				templateUrl: "templates/system/tabs.html",
			}
		}
	})

	.state('menu.tabs.home', {
		url: "/home",
		views: {
			'tab-static': {
				templateUrl: "templates/home.html",
				controller: 'HomeController',
			}
		}
	})

	.state('menu.tabs.pain', {
		url: "/pain",
		views: {
			'tab-pain': {
				templateUrl: "templates/pain/home.html",
			}
		}
	})

	.state('menu.tabs.pain_my_cycle', {
		url: "/pain-my-cycle",
		views: {
			'tab-pain': {
				templateUrl: "templates/pain/pain_my_cycle.html",
				controller: "UserController"
			}
		}
	})

	.state('menu.tabs.pain_my_results', {
		url: "/pain-my-results",
		views: {
			'tab-pain': {
				templateUrl: "templates/pain/pain_my_results.html",
			}
		}
	})

	.state('menu.tabs.pain_spouse_cycle', {
		url: "/pain-spouse-cycle",
		views: {
			'tab-pain': {
				templateUrl: "templates/pain/pain_spouse_cycle.html",
				controller: "UserController"
			}
		}
	})

	.state('menu.tabs.pain_our_results', {
		url: "/pain-our-results",
		views: {
			'tab-pain': {
				templateUrl: "templates/pain/pain_our_results.html",
			}
		}
	})

	.state('menu.tabs.peace', {
		url: "/peace",
		views: {
			'tab-peace': {
				templateUrl: "templates/peace/home.html",
			}
		}
	})

	.state('menu.tabs.peace_my_cycle', {
		url: "/peace-my-cycle",
		views: {
			'tab-peace': {
				templateUrl: "templates/peace/peace_my_cycle.html",
				controller: "UserController"
			}
		}
	})

	.state('menu.tabs.peace_my_results', {
		url: "/peace-my-results",
		views: {
			'tab-peace': {
				templateUrl: "templates/peace/peace_my_results.html",
			}
		}
	})

	.state('menu.tabs.peace_spouse_cycle', {
		url: "/peace-spouse-cycle",
		views: {
			'tab-peace': {
				templateUrl: "templates/peace/peace_spouse_cycle.html",
				controller: "UserController"
			}
		}
	})

	.state('menu.tabs.peace_our_results', {
		url: "/peace-our-results",
		views: {
			'tab-peace': {
				templateUrl: "templates/peace/peace_our_results.html",
			}
		}
	})

	.state('menu.tabs.4steps', {
		url: "/4steps",
		views: {
			'tab-4steps': {
				templateUrl: "templates/4steps/home.html",
			}
		}
	})

	.state('menu.tabs.4steps_info', {
		url: "/4steps-info",
		views: {
			'tab-4steps': {
				templateUrl: "templates/4steps/4steps_info.html",
			}
		}
	})

	.state('menu.tabs.4steps_choose', {
		url: "/4steps-choose",
		views: {
			'tab-4steps': {
				templateUrl: "templates/4steps/4steps_choose.html",
				controller: "UserController"
			}
		}
	})

	.state('menu.tabs.4steps_exercise', {
		url: "/4steps-exercise",
		views: {
			'tab-4steps': {
				templateUrl: "templates/4steps/4steps_exercise.html",
			}
		}
	})

	.state('menu.tabs.teamwork', {
		url: "/teamwork",
		views: {
			'tab-teamwork': {
				templateUrl: "templates/teamwork/home.html",
			}
		}
	})

	.state('menu.tabs.teamwork_info', {
		url: "/teamwork-info",
		views: {
			'tab-teamwork': {
				templateUrl: "templates/teamwork/teamwork_info.html",
			}
		}
	})

	.state('menu.tabs.teamwork_video', {
		url: "/teamwork-video",
		views: {
			'tab-teamwork': {
				templateUrl: "templates/teamwork/teamwork_video.html",
			}
		}
	})

	.state('menu.tabs.teamwork_exercise', {
		url: "/teamwork-exercise",
		views: {
			'tab-teamwork': {
				templateUrl: "templates/teamwork/teamwork_exercise.html",
			}
		}
	})

	.state('menu.tabs.teamwork_exercise_create', {
		url: "/teamwork-exercise-create",
		views: {
			'tab-teamwork': {
				templateUrl: "templates/teamwork/teamwork_exercise.html",
				controller: "ExerciseController"
			}
		},
		resolve: {
			exercise: function (UserService, $stateParams) {
				console.log('menu.tabs.teamwork_exercise_create.resolve');
				return {};
			}
		}

	})

	.state('menu.tabs.teamwork_exercise_view', {
		url: "/teamwork-exercise-view/:exercise",
		cache: false,
		views: {
			'tab-teamwork': {
				templateUrl: "templates/teamwork/teamwork_exercise_view.html",
				controller: "ExerciseController"
			}
		},
		resolve: {
			exercise: function ($q, $state, UserService, $stateParams) {
				console.log('menu.tabs.teamwork_exercise_view.resolve');
				var deferred = $q.defer();
				UserService.exercise($stateParams.exercise).then(function (hasExercise) {
					if (hasExercise) {
						deferred.resolve(hasExercise);
					} else {
						$state.go('menu.tabs.teamwork_exercise_results');
						//deferred.reject('Not logged in');
					}
				});

				return deferred.promise;
			}
		}

	})

	.state('menu.tabs.teamwork_exercise_edit', {
		url: "/teamwork-exercise-edit/:exercise",
		cache: false,
		views: {
			'tab-teamwork': {
				templateUrl: "templates/teamwork/teamwork_exercise.html",
				controller: "ExerciseController"
			}
		},
		resolve: {
			exercise: function ($q, $state, UserService, $stateParams) {
				console.log('menu.tabs.teamwork_exercise_edit.resolve');
				var deferred = $q.defer();
				UserService.exercise($stateParams.exercise).then(function (hasExercise) {
					if (hasExercise) {
						deferred.resolve(hasExercise);
					} else {
						$state.go('menu.tabs.teamwork_exercise_results');
					}
				});

				return deferred.promise;
			}
		}

	})

	.state('menu.tabs.teamwork_exercise_results', {
		url: "/teamwork-exercise-results",
		views: {
			'tab-teamwork': {
				templateUrl: "templates/teamwork/teamwork_exercise_results.html",
			}
		}
	})

	.state('menu.tabs.growth', {
		url: "/growth",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/home.html",
			}
		}
	})

	.state('menu.tabs.growth_values', {
		url: "/growth-values",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/growth_values.html",
				controller: "UserController"
			}
		}
	})

	.state('menu.tabs.growth_vision', {
		url: "/growth-vision",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/growth_vision.html",
				controller: "UserController"
			}
		}
	})

	.state('menu.tabs.growth_quiz', {
		url: "/growth-quiz",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/growth_quiz.html",
				controller: "QuizController"
			}
		}
	})

	.state('menu.tabs.growth_quiz_physical', {
		url: "/growth-quiz-physical",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/growth_quiz_physical.html",
				controller: "QuizController"
			}
		}
	})

	.state('menu.tabs.growth_quiz_physical_score', {
		url: "/growth-quiz-physical-score",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/growth_quiz_physical_score.html",
			}
		}
	})

	.state('menu.tabs.growth_quiz_mental', {
		url: "/growth-quiz-mental",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/growth_quiz_mental.html",
				controller: "QuizController"
			}
		}
	})

	.state('menu.tabs.growth_quiz_mental_score', {
		url: "/growth-quiz-mental-score",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/growth_quiz_mental_score.html",
			}
		}
	})

	.state('menu.tabs.growth_quiz_emotional', {
		url: "/growth-quiz-emotional",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/growth_quiz_emotional.html",
				controller: "QuizController"
			}
		}
	})

	.state('menu.tabs.growth_quiz_emotional_score', {
		url: "/growth-quiz-emotional-score",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/growth_quiz_emotional_score.html",
			}
		}
	})

	.state('menu.tabs.growth_quiz_spiritual', {
		url: "/growth-quiz-spiritual",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/growth_quiz_spiritual.html",
				controller: "QuizController"
			}
		}
	})

	.state('menu.tabs.growth_quiz_spiritual_score', {
		url: "/growth-quiz-spiritual-score",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/growth_quiz_spiritual_score.html",
			}
		}
	})

	.state('menu.tabs.growth_quiz_results', {
		url: "/growth-quiz-results",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/growth_quiz_results.html",
			}
		}
	})

	.state('menu.tabs.growth_90days', {
		url: "/growth-90days",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/growth_90days.html",
			}
		}
	})

	.state('menu.tabs.about', {
		url: "/about",
		views: {
			'tab-static': {
				templateUrl: "templates/static/about.html",
			}
		}
	})

	.state('menu.tabs.groups', {
		url: "/groups",
		views: {
			'tab-static': {
				templateUrl: "templates/static/groups.html",
			}
		}
	})

	.state('menu.tabs.intensives', {
		url: "/intensives",
		views: {
			'tab-static': {
				templateUrl: "templates/static/intensives.html",
			}
		}
	})

	.state('menu.tabs.therapists', {
		url: "/therapists",
		views: {
			'tab-static': {
				templateUrl: "templates/static/therapists.html",
			}
		}
	})

	.state('menu.tabs.resources', {
		url: "/resources",
		views: {
			'tab-static': {
				templateUrl: "templates/static/resources.html",
			}
		}
	})

	.state('menu.tabs.products', {
		url: "/products",
		views: {
			'tab-static': {
				templateUrl: "templates/static/products.html",
			}
		}
	})

	.state('menu.tabs.app_info', {
		url: "/app_info",
		views: {
			'tab-static': {
				templateUrl: "templates/static/app_info.html",
			}
		}
	})

	.state('menu.tabs.settings', {
		url: "/settings",
		views: {
			'tab-static': {
				templateUrl: "templates/static/settings.html",
			}
		}
	})

	.state('menu.tabs.profile', {
		url: "/profile",
		cache: false,
		views: {
			'tab-static': {
				templateUrl: "templates/user/profile.html",
				controller: "UserController"
			}
		}
	})

	.state('menu.tabs.notifications', {
		url: "/notifications",
		views: {
			'tab-static': {
				templateUrl: "templates/static/notifications.html",
			}
		}
	})

	.state('login', {
		url: "/login",
		templateUrl: "templates/user/login.html",
		controller: 'LoginController'
	})

	.state('signup', {
		url: "/signup",
		templateUrl: "templates/user/signup.html",
		controller: 'SignupController'
	})

	.state('forgot', {
		url: "/forgot",
		templateUrl: "templates/user/forgot.html",
		controller: 'ForgotController'
	})

	.state('terms', {
		url: "/terms",
		templateUrl: "templates/static/terms.html"
	})

	.state('privacy', {
		url: "/privacy",
		templateUrl: "templates/static/privacy.html"
	})

	$urlRouterProvider.otherwise('/menu/tabs/home');
})