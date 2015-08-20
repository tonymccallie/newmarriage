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
		templateUrl: "templates/menu.html",
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
				templateUrl: "templates/tabs.html",
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
	
	.state('menu.tabs.about', {
		url: "/about",
		views: {
			'tab-static': {
				templateUrl: "templates/about.html",
			}
		}
	})
	
	.state('menu.tabs.resources', {
		url: "/resources",
		views: {
			'tab-static': {
				templateUrl: "templates/resources.html",
			}
		}
	})
	
	.state('menu.tabs.products', {
		url: "/products",
		views: {
			'tab-static': {
				templateUrl: "templates/products.html",
			}
		}
	})
	
	.state('menu.tabs.app_info', {
		url: "/app_info",
		views: {
			'tab-static': {
				templateUrl: "templates/app_info.html",
			}
		}
	})
	
	.state('menu.tabs.profile', {
		url: "/profile",
		cache: false,
		views: {
			'tab-static': {
				templateUrl: "templates/profile.html",
				controller: "UserController"
			}
		}
	})
	
	.state('menu.tabs.notifications', {
		url: "/notifications",
		views: {
			'tab-static': {
				templateUrl: "templates/notifications.html",
			}
		}
	})

	.state('login', {
		url: "/login",
		templateUrl: "templates/login.html",
		controller: 'LoginController'
	})

	.state('signup', {
		url: "/signup",
		templateUrl: "templates/signup.html",
		controller: 'SignupController'
	})

	.state('forgot', {
		url: "/forgot",
		templateUrl: "templates/forgot.html",
		controller: 'ForgotController'
	})
	
	.state('terms', {
		url: "/terms",
		templateUrl: "templates/terms.html"
	})
	
	.state('privacy', {
		url: "/privacy",
		templateUrl: "templates/privacy.html"
	})

	$urlRouterProvider.otherwise('/menu/tabs/home');
})