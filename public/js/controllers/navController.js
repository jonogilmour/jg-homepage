/*
	Navigation Controller
	- isActive(string) :
		Takes a string URL and returns true if the current URL matches
*/
angular.module("JGilmour").controller("NavController", ["$scope", 
function($scope) {
	$scope.isActive = function (viewLocation) {
		return viewLocation === window.location.pathname;
    };
}]);