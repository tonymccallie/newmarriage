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
			return JSON.parse(json);
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