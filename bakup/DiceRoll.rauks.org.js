"use strict";

var DiceRoll = angular.module('DiceRoll', ['ngRoute', 'ngMaterial', 'ngMessages', 'ngAnimate'])

DiceRoll.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
}]);

// Define routes
DiceRoll.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/views/choosedice.html'
    })
    .when('/blue', {
      templateUrl: '/views/bluedice.html'
    })
    .when('/orange', {
      templateUrl: '/views/orangedice.html'
    })
    .when('/red', {
      templateUrl: '/views/reddice.html'
    })
    .when('/darknumber', {
      templateUrl: '/views/darknumberdice.html'
    })
    .when('/dark', {
      templateUrl: '/views/darkdice.html'
    })
    .when('/dark2', {
      templateUrl: '/views/darkdice2.html'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

// New shake
var myShakeEvent = new Shake({
  threshold: 5,
  timeout: 10
});

// start listening to device motion
myShakeEvent.start();

// register a shake event on directive
DiceRoll.directive('shakeIt', ['$window', function($window) {
  var timer;
  return {
    link: function(scope) {
      angular.element($window).on('shake', function(e) {
        // Create a shaked event
        scope.$broadcast('shakeIt::shaking');
        clearInterval(timer);
        timer = setInterval(function() {
          scope.$broadcast('shakeIt::shaked');
          clearInterval(timer);
        }, 500);
      });
    }
  };
}]);

DiceRoll.directive('myRandomshow', function() {
  //Seed for Math.seedrandom
  var enthropygen = 0;
  var rdmnumber;



  return {
    link: function(scope, element) {
      var minnum = 2;
      var maxnum = element.children().length - 1;


      // Ensure everything is initialy hidden
      element.children().attr('hide', 'false');
      //Show Shake Icon
      element.children().eq('0').removeAttr('hide');

      scope.$on('shakeIt::shaking', function() {

        enthropygen++;
        // Show only circle while shaking
        element.children().attr('hide', 'true');
        element.children().eq('1').removeAttr('hide');
      });
      scope.$on('shakeIt::shaked', function() {
        // Show result
        enthropygen++;
        element.children().attr('hide', 'true');
        Math.seedrandom(enthropygen, {
          entropy: true
        });

        rdmnumber = Math.floor(Math.random() * (maxnum - minnum + 1) + minnum);

        // For test :
        // console.log(rdmnumber);
        // console.log(enthropygen);

        element.children().eq(rdmnumber).removeAttr('hide');
      });
    }
  };
});


DiceRoll.controller("DiceRollCtrl", ['$scope', '$interval', function($scope, $interval) {

  // Desktop Mouse down fallback
  $scope.desktopmdown = function() {
    // prevent from execution on mobile (display bug)
    if (!isMobile.any) {
      
      
      $scope.startroll();
    }
  };
  // Desktop Mouse up fallback
  $scope.desktopmup = function() {
    // prevent from execution on mobile (display bug)
    if (!isMobile.any) {
      $scope.stoproll();
      $scope.$broadcast('shakeIt::shaked');
    }
  };


  // store the interval promise
  var promise;
  // starts the interval
  $scope.startroll = function() {
    // stops any running interval to avoid two intervals running at the same time
    $scope.stoproll();
    // store the interval promise
    promise = $interval(DesktopRolling, 10);
  };
  // stops the interval
  $scope.stoproll = function() {
    $interval.cancel(promise);
  };
  // stops the interval when the scope is destroyed
  $scope.$on('$destroy', function() {
    $scope.stoproll();

  });
  //Rolling Function Desktop Fallback
  var DesktopRolling = function() {
    $scope.$broadcast('shakeIt::shaking');
  };

}]);

DiceRoll.config(['$mdIconProvider', function($mdIconProvider) {
    // Register icon IDs with sources. Future $mdIcon( <id> ) lookups
    // will load by url and retrieve the data via the $http and $templateCache
    $mdIconProvider
      .icon('3Ddice:blue', '/img/3Dblue.svg', 1000)
      .icon('3Ddice:orange', '/img/3Dorange.svg', 1000)
      .icon('3Ddice:red', '/img/3Dred.svg', 1000)
      .icon('3Ddice:dark', '/img/3Ddark.svg', 1000)
      .icon('icon:shake', '/img/ic_vibration_48px.svg', 48)
      .icon('icon:back', '/img/ic_arrow_back_48px.svg', 48)
      .icon('dice:dsuccess', '/img/dice/dsuccess.svg', 1000)
      .icon('dice:efail', '/img/dice/efail.svg', 1000)
      .icon('dice:fail', '/img/dice/fail.svg', 1000)
      .icon('dice:four', '/img/dice/four.svg', 1000)
      .icon('dice:skill', '/img/dice/skill.svg', 1000)
      .icon('dice:success', '/img/dice/success.svg', 1000)
      .icon('dice:three', '/img/dice/three.svg', 1000)
      .icon('dice:two', '/img/dice/two.svg', 1000);
  }])
  .run(['$http', '$templateCache', function($http, $templateCache) {
    var urls = [
      '/img/3Dblue.svg',
      '/img/3Dorange.svg',
      '/img/3Dred.svg',
      '/img/3Ddark.svg',

      '/img/ic_vibration_48px.svg',
      '/img/ic_arrow_back_48px.svg',

      '/img/dice/success.svg',
      '/img/dice/efail.svg',
      '/img/dice/fail.svg',
      '/img/dice/four.svg',
      '/img/dice/skill.svg',
      '/img/dice/success.svg',
      '/img/dice/three.svg',
      '/img/dice/two.svg'
    ];
    // Pre-fetch icons sources by URL and cache in the $templateCache...
    // subsequent $http calls will look there first.
    angular.forEach(urls, function(url) {
      $http.get(url, {
        cache: $templateCache
      });
    });
  }]);