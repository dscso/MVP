var app = angular.module('MVP', [
  'ngRoute',
  'ngCookies',
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
      .when('/admin', {
        templateUrl: 'templates/admin.html',
        controller: adminCtrl,
        controllerAs: 'adminCtrl',
        name : "Admin",
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
        require: "ngChange",
        templateUrl: "templates/navigation.html",
        controllerAs: "navCtrl",
        controller: function ($scope, $translate, $http) {
           $http.get("static/languages/languages.json").success(function (response) {
               $scope.languages = response.languages;
           });
           $scope.changeLang = function (key) {
              $translate.use(key)
           };
           $scope.isLang = function (key) {
               return $translate.use() === key;
           };
           $scope.routes = routeNavigation.routes;
           $scope.activeRoute = routeNavigation.activeRoute;
        }
    };
});

app.config(function($translateProvider) {
    $translateProvider.useCookieStorage();
    $translateProvider.preferredLanguage('en_US');
    $translateProvider.useStaticFilesLoader({
        prefix: 'static/languages/',
        suffix: '.json'
    });
});
app.controller('langCtrl', function ($scope, $translate, $http) {
  $http.get("static/languages/languages.json").success(function (response) {
    $scope.languages = response.languages;
  });
  $scope.changeLanguage = function (key) {
    $translate.use(key);
  };
});
var homeCtrl = ['$routeParams', '$http', function($routeParams, $http){
   var controller = this;
   this.week = 0;
   this.changeWeek = function (newWeek) {
       console.log(newWeek);
       controller.week = newWeek;
       this.loadDays();
   };
   this.loadDays = function () {
   //var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
   var days = ["Mo.","Tu.","We.","Th.","Fr.","Sa.","Su."]
   this.dayList = []
   var i = 0;
   days.forEach (function (val) {
       controller.dayList.push({
          i : i,
          timestamp : moment().isoWeek(moment().isoWeek() + controller.week).isoWeekday(i).unix() * 1000
       });
       i = i + 1;
   });
   };
   this.weekFrom = function () {
       return moment().isoWeek(moment().isoWeek() + controller.week).isoWeekday(1).unix() * 1000;
   };
   this.weekTo = function () {
       return moment().isoWeek(moment().isoWeek() + controller.week).isoWeekday(7).unix() * 1000;
   };
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

var adminCtrl = function ($scope) {
    
};
