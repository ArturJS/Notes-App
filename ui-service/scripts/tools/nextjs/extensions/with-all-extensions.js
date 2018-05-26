const _ = require('lodash');
const withFlowSupport = require('./with-flow-support');
const withExcludeModules = require('./with-exclude-modules');
const withFonts = require('./with-fonts');
const withStyles = require('./with-styles');

module.exports = _.flow([
    withFlowSupport,
    withExcludeModules,
    withFonts,
    withStyles
]);
