var DOMAIN = 'http://newmarriage.server1.greyback.net/'
//DEVELOPMENT
var devtest = /localhost/.test(window.location.hostname);
if (devtest) {
	DOMAIN = 'http://localhost/marriagestrong_server';
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
	html = html.replace(/href=\"\//ig, 'href="http://www.newmarriage.org/');
	html = html.replace(/src=\"\//ig, 'src="http://www.newmarriage.org/');
	return html.replace(/href=\"(.+?)\"/gi, 'onclick="window.open(\'$1\',\'_system\',\'location=yes\');"');
}

angular.module('greyback', ['ionic', 'ngCordova', 'ImgCache', 'ionic.service.core', 'ionic.service.push', 'ionic.service.deploy', 'ionic.service.analytics', 'ionic-datepicker','ngOpenFB', 'ngMessages', 'jrCrop', 'greyback.controllers', 'greyback.services', 'greyback.utils'])

.run(function ($rootScope, $ionicPlatform, $ionicAnalytics, $cordovaSplashscreen, ImgCache, ngFB) {
	console.log('App.run');
	ngFB.init({
		appId: '850066335072761',
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
	
	.state('menu.tabs.4steps_excercise', {
		url: "/4steps-excercise",
		views: {
			'tab-4steps': {
				templateUrl: "templates/4steps/4steps_excercise.html",
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
	
	.state('menu.tabs.teamwork_excercise', {
		url: "/teamwork-excercise",
		views: {
			'tab-teamwork': {
				templateUrl: "templates/teamwork/teamwork_excercise.html",
			}
		}
	})
    
    .state('menu.tabs.teamwork_excercise_results', {
		url: "/teamwork-excercise-results",
		views: {
			'tab-teamwork': {
				templateUrl: "templates/teamwork/teamwork_excercise_results.html",
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
			}
		}
	})
	
	.state('menu.tabs.growth_vision', {
		url: "/growth-vision",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/growth_vision.html",
			}
		}
	})
	
	.state('menu.tabs.growth_quiz', {
		url: "/growth-quiz",
		views: {
			'tab-growth': {
				templateUrl: "templates/growth/growth_quiz.html",
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