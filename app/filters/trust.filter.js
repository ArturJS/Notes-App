require([
  'app'
], function (app) {
  'use strict';

  angular
    .module('App')
    .filter('trust', ['$sce', function ($sce) {
      return filter;

      function filter(value, source) {
        var result;

        if (!value || !angular.isString(value)) {
          return '';
        }

        switch (source.toLowerCase()) {
          case 'url':
            result = $sce.trustAsResourceUrl(value);
            break;
          case 'html':
            result = $sce.trustAsHtml(value);
            break;
          case 'js':
            result = $sce.trustAsJs(value);
            break;
          default:
            result = value;
        }
        return result;
      }
    }]);

});
