angular.module('greyback.utils', [])

.service('UtilService', function() {
	var self = this;
	this.countBool = function (obj) {
		var count = 0;
		for (var key in obj) {
			if (obj[key]) {
				count++;
			}
		}
		return count;
	}

	this.sumObj = function (obj) {
		var count = 0;
		for (var key in obj) {
			count += parseInt(obj[key]);
		}
		return count;
	}
})

.service('$util', function ($ionicPopup) {
	console.warn('$util');
	var self = this;

	self.alert = function (msg) {
		console.log('$util.alert');
		return $ionicPopup.alert({
			title: null,
			template: msg,
			okText: 'Continue',
			okType: 'button-positive'
		});
	}

	self.confirm = function (msg, btns) {
		console.log('$util.confirm');
		return $ionicPopup.confirm({
			title: null,
			template: msg,
			okText: 'Continue',
			okType: 'button-positive',
			cancelText: 'Cancel'
		});
	}
	
	self.prompt = function(msg) {
		return $ionicPopup.prompt({
			title: null,
			template: msg,
			okType: 'button-positive',
			cancelText: 'Cancel'
		});
	}

	self.range = function (min, max, step) {
		step = step || 1;
		var input = [];
		for (var i = min; i <= max; i += step) {
			input.push(i);
		}
		return input;
	};
})

.service('$data', function ($q, $http, $location, $ionicSlideBoxDelegate, $localStorage, $ionicLoading, $state, $util) {
	console.warn('$data');
	var self = this;

	//initialize values
	self.values = {};

	//	This function populates data from a service IF EMPTY
	//	e.g. (latest news)
	self.populate = function ($config, obj) {
		console.log(['$data.populate:' + $config.name, $config]);

		var deferred = $q.defer();

		//initialize array value if non-existent
		if (typeof self.values[$config.name] == 'undefined') {
			self.values[$config.name] = [];
		}

		if (self.values[$config.name].length === 0) {
			console.log($config.name + ': no records');

			//check for a local version
			self.local($config.name).then(function (localRecords) {
				if (localRecords.length > 0) {
					console.log($config.name + ': use local');
					self.values[$config.name] = localRecords;
					deferred.resolve(self.values[$config.name]);
				} else {
					console.log($config.name + ': use remote');
					self.remote($config.name, $config.url).then(function (remoteRecords) {
						console.log($config.name + ': got remote');
						self.values[$config.name] = remoteRecords;
						deferred.resolve(remoteRecords);
					});
				}
				obj[$config.variable] = self.values[$config.name];
			});
		} else {
			console.log($config.name + ': had values');
			deferred.resolve(self.values);
		}

		return deferred.promise;
	}

	// $http.get wrapper
	self.get = function ($config, obj) {
		console.log(['$data.get:' + $config.name, $config]);
		var deferred = $q.defer();
		self.remote($config.name, $config.url, null).then(function (remoteRecords) {
			console.log($config.name + ': got remote');
			self.values[$config.name] = remoteRecords;
			obj[$config.variable] = self.values[$config.name];
			deferred.resolve(remoteRecords);
		});

		return deferred.promise;
	}
	
	self.sync = function($config, obj, data) {
		
	}

	// $http.post wrapper
	self.post = function ($config, obj, data) {
		console.log(['$data.post:' + $config.name, $config]);
		var deferred = $q.defer();
		self.remote($config.name, $config.url, data).then(function (remoteRecords) {
			console.log($config.name + ': got remote');
			self.values[$config.name] = remoteRecords;
			obj[$config.variable] = self.values[$config.name];
			deferred.resolve(remoteRecords);
		});

		return deferred.promise;
	}

	// get localStorage info
	self.local = function ($name) {
		console.log('$data.local(' + $name + ')');
		var deferred = $q.defer();
		var localRecords = $localStorage.getArray($name);
		deferred.resolve(localRecords);
		return deferred.promise;
	}

	// ajax calls
	self.remote = function ($name, $url, data) {
		console.log('$data.remote(' + $name + ')');
		console.log([$url, data]);
		$ionicLoading.show();

		var deferred = $q.defer();
		var method = 'GET';

		if (data) {
			method = 'POST';
		}

		var promise = $http({
				url: DOMAIN + $url,
				method: method,
				data: data
			})
			.success(function (result) {
				console.log('$data.remote(' + $name + ').success');
				$ionicLoading.hide();

				switch (result.status) {
					case "SUCCESS":
						//store local copy for populate
						$localStorage.setArray($name, result.data);
						deferred.resolve(result.data);
						break;
					default:
						$util.alert('Error on ' + $name + ': see log');
						console.log(result);
						break;
				}
			})
			.error(function (result) {
				console.log(['error', result]);
				$util.alert('There was an error processing your request. Please try again later.');
				$ionicLoading.hide();
			});


		return deferred.promise;
	}
})

.filter('trusted', function ($sce) {
	return function (url) {
		return $sce.trustAsResourceUrl(url);
	};
})

.factory('$localStorage', function ($window) {
	return {
		set: function (key, value) {
			$window.localStorage[key] = value;
		},
		get: function (key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},
		setObject: function (key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function (key) {
			return JSON.parse($window.localStorage[key] || '{}');
		},
		setArray: function (key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getArray: function (key) {
			return JSON.parse($window.localStorage[key] || '[]');
		},
		remove: function (key) {
			return $window.localStorage.removeItem(key);
		},
		toJSON: function (obj) {
			return JSON.stringify(obj);
		},
		toObj: function (json) {
			return JSON.parse(json || "{}");
		},
	}
})

.directive('compareTo', function () {
	return {
		require: "ngModel",
		scope: {
			otherModelValue: "=compareTo"
		},
		link: function (scope, element, attributes, ngModel) {

			ngModel.$validators.compareTo = function (modelValue) {
				return modelValue == scope.otherModelValue;
			};

			scope.$watch("otherModelValue", function () {
				ngModel.$validate();
			});
		}
	};
})