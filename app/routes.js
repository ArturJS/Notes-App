require([
  'app'
], function(app) {
  'use strict';

  app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/todolist");

    $stateProvider
      .state('todoPage', {
        url: '/todolist',
        templateUrl: 'todolist.html',
        controller: 'ToDoCtrl as todoPage'
      });

  }]);
});
