const _ = require('lodash');
const withTypescriptSupport = require('./with-typescript-support');
const withExcludeModules = require('./with-exclude-modules');
const withFonts = require('./with-fonts');
const withStyles = require('./with-styles');

module.exports = _.flow([
    withTypescriptSupport,
    withExcludeModules,
    withFonts,
    withStyles
]);
