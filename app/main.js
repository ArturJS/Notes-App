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
    'trust-filter': './filters/trust.filter'
  },

  shim: {
    'lodash': {
      exports: '_'
    },

    'angular': {
      exports: 'angular',
      deps: ['lodash']
    },

    'firebase': {
      exports: 'firebase'
    },

    'firebase-config': {
      deps: ['firebase']
    },

    'angularfire': {
      exports: 'angularfire',
      deps: ['angular', 'firebase-config']
    },

    'angular-ui-router': {
      deps: ['angular']
    },

    'templates': {
      deps: ['angular']
    },

    'app': {
      deps: ['angular-ui-router']
    },

    'todo-ctrl': {
      deps: ['angular', 'firebase-config', 'trust-filter']
    },

    'routes': {
      deps: ['todo-ctrl', 'templates']
    },

    'trust-filter': {
      deps: ['angular']
    }
  },

  deps: ['./bootstrap']
});
