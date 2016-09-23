define([
    'angular',
    'angular-ui-router',
    'firebase',
    'angularfire',
    'templates'
], function (ng) {
    'use strict';

    return ng.module('App', [
        'ui.router', 
        'firebase', 
        'templates'
    ]);
});