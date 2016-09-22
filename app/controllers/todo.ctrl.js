'use strict';
/**
 * @file todo.ctrl.js
 *
 * @author Artur_Nizamutdinov
 * @date 9/22/2016
 */
App.controller('ToDoCtrl', ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {
  var vm = this,
      todoStoreRef = firebase.database().ref().child('todos');

  init();

  function init(){
    vm.todoList = $firebaseArray(todoStoreRef);
    vm.newTodo = getEmptyTodo();
  }

  vm.addTodo = function () {
    vm.todoList.$add(angular.copy(vm.newTodo));
    vm.newTodo = getEmptyTodo();
  };

  function getEmptyTodo() {
    return angular.copy({
      title: '',
      description: ''
    });
  }
}]);
