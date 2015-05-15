/* 
* @Author: vokoshyv
* @Date:   2015-05-15 10:35:12
* @Last Modified by:   vokoshyv
* @Last Modified time: 2015-05-15 10:45:05
*/

'use strict';

var scheduleController = function($scope, $rootScope){

  console.log($rootScope.scheduleInfo);



};


angular
  .module('app.schedule', [])

  .controller('ScheduleController', scheduleController);