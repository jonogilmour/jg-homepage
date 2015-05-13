/*
	Navigation directive
	- Only assigns controller to nav element
*/
angular.module("JGilmour").directive("jgNav", function() {
	return {
		restrict: "A",
		replace: false,
		controller: "navController",
		controllerAs: "nav"
	};
});