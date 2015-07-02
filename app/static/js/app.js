var app = angular.module('MVP', [
  'ngRoute',
  'pascalprecht.translate'

]);

app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/index.html',
        controller: homeCtrl,
        controllerAs : 'homeCtrl',
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
    if (route.name) { // if name is given show it in the menu
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

var homeCtrl = ['$http', function($http){
   var controller = this;
   //var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
   var days = ["Mo.","Tue.","Wed.","Thu.","Fr.","Sa.","Sun."]
   this.dayList = []
   var i = 1;
   days.forEach (function (val) {
       controller.dayList.push({
          name : val,
          timestamp : moment().isoWeekday(i).unix() * 1000
       });
   i = i + 1;
   });
   
   controller.vacations = [];
   controller.members = [];
   $http.get("members.json").success(function (data) {
       controller.members = data.members;
   });
   $http.get("vacations.json").success(function (data) {
       controller.vacations = data.vacations;
   });
   this.isAway = function (member, timestamp) {
      var isAway = false;
      controller.vacations.forEach (function (obj) {
          if (obj.from < timestamp && obj.to > timestamp && obj.mail == member) {
              isAway = true;
          }
      });
      return isAway;
   };
}];
