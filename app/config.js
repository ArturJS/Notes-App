'use strict';
/**
 * @file config.js
 *
 * @author Artur_Nizamutdinov
 * @date 9/22/2016
 */
App.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/todolist");

  $stateProvider
    .state('todoPage', {
      url: '/todolist',
      templateUrl: 'todolist.html',
      controller: 'ToDoCtrl as todoPage'
    });

}]);
