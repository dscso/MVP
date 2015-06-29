var app = angular.module('MVP', [
  'ngRoute',
  'pascalprecht.translate'

]);

app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/index.html',
        name : "Home",
      })
      .when('/login', {
        templateUrl: 'templates/login.html',
        name : "Login",
      }).otherwise({
        redirectTo: "/"
      });
}]);

app.factory('routeNavigation', function($route, $location) {
  var routes = [];
  angular.forEach($route.routes, function (route, path) {
    if (route.name) {
      routes.push({
        path: path,
        name: route.name
      });
    }
  });
  return {
    routes: routes,
    activeRoute: function (route) {
      return route.path === $location.path();
    }
  };
});

app.directive('navigation', function (routeNavigation) {
    return {
        restrict: "E",
	replace: true,
        templateUrl: "templates/navigation.html",
        controller: function ($scope) {
           $scope.routes = routeNavigation.routes;
           $scope.activeRoute = routeNavigation.activeRoute;
        }
    };
});

