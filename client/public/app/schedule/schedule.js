/*
* @Author: vokoshyv
* @Date:   2015-05-15 10:35:12
* @Last Modified by:   vincetam
* @Last Modified time: 2015-05-15 17:37:16
*/

'use strict';

var scheduleController = function($scope, $rootScope, $state){



  console.log("SCHEDULE INFO: ", $rootScope.scheduleInfo);

  $scope.returnToMap = function(){
    $state.go('home');
  };

  $scope.goToRSVP = function(){
    $state.go('rsvp');
  };

};


angular
  .module('app.schedule', [
    'ui.router'
  ])

  .controller('ScheduleController', scheduleController);