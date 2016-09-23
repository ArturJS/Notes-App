require.config({
 
      paths: {
         'firebase': '../bower_components/firebase/firebase',
         'firebase-config': 'firebase.config',
         'lodash': '../bower_components/lodash/lodash',
         'domReady': '../bower_components/requirejs-domready/domReady',
         'angular': '../bower_components/angular/angular',
         'angularfire': '../bower_components/angularfire/dist/angularfire',
         'angular-ui-router': '../bower_components/angular-ui-router/release/angular-ui-router',
         'templates': 'templates',
         'app': 'app',
         'routes': 'routes',
         'todo-ctrl': './controllers/todo.ctrl',
     },
 
     shim: {
         'angular': {
             exports: 'angular'
         },
         
         'firebase': {
             exports: 'firebase'
         },
         
         'angularfire': {
             exports: 'angularfire'
         }
     },
 
     deps: ['./bootstrap']
});