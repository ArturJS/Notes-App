define([
  'app',
  'firebase',
  'todo-ctrl',
], function(app, firebase) {
  'use strict';


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC6LDuww70ztN7YfscpvEHrkJteSdvPco8",
    authDomain: "angulartodo-561d2.firebaseapp.com",
    databaseURL: "https://angulartodo-561d2.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "956700524818"
  };
  firebase.initializeApp(config);

  return app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/todolist");

    $stateProvider
      .state('todoPage', {
        url: '/todolist',
        templateUrl: 'todolist.html',
        controller: 'ToDoCtrl as todoPage'
      });

  }]);
});