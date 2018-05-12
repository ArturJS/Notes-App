const _ = require('lodash');
const withPreact = require('@zeit/next-preact');
const withFlowSupport = require('./with-flow-support');
const withExcludeModules = require('./with-exclude-modules');
const withFonts = require('./with-fonts');
const withStyles = require('./with-styles');

module.exports = _.flow([
    withPreact,
    withFlowSupport,
    withExcludeModules,
    withFonts,
    withStyles
]);
