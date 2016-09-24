require([
  'app',
  'firebase',
  'lodash'
], function (app, firebase, _) {
  'use strict';

  app.controller('ToDoCtrl', ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {
    var vm = this,
      todoStoreRef = firebase.database().ref().child('todos');

    init();

    function init() {
      angular.extend(vm, {
        todoList: $firebaseArray(todoStoreRef),
        newTodo: getEmptyTodo(),
        isEditingTodo: {},
        addTodo: addTodo,
        removeTodo: removeTodo,
        editTodo: editTodo,
        saveTodo: saveTodo
      });
    }

    function addTodo() {
      var newTodo = angular.extend({id: Math.random()}, vm.newTodo);
      vm.todoList.$add(newTodo);
      vm.newTodo = getEmptyTodo();
    }

    function removeTodo(index) {
      vm.todoList.$remove(index);
    }

    function editTodo(id) {
      vm.isEditingTodo[id] = true;
    }

    function saveTodo(index, id) {
      vm.isEditingTodo[id] = false;
      vm.todoList.$save(index);
    }

    function getEmptyTodo() {
      return angular.copy({
        title: '',
        description: ''
      });
    }

  }]);
});
