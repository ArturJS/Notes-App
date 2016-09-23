define([
  'app',
  'firebase'
], function(app, firebase) {
  'use strict';
  
  app.controller('ToDoCtrl', ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {
    var vm = this,
        todoStoreRef = firebase.database().ref().child('todos');

    init();

    function init(){
      vm.todoList = $firebaseArray(todoStoreRef);
      vm.newTodo = getEmptyTodo();
      vm.isEditingTodo = {};
    }

    vm.addTodo = function () {
      vm.todoList.$add(angular.copy(vm.newTodo));
      vm.newTodo = getEmptyTodo();
    };

    vm.removeTodo = function (index) {
      vm.todoList.$remove(index);
    };

    vm.editTodo = function (index) {
      vm.isEditingTodo[index] = true;
    };

    vm.saveTodo = function (index) {
      vm.isEditingTodo[index] = false;
      vm.todoList.$save(index);
    };

    function getEmptyTodo() {
      return angular.copy({
        title: '',
        description: ''
      });
    }

  }]);
});