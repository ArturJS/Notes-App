const withAllExtensions = require('./scripts/tools/nextjs/extensions/with-all-extensions');

module.exports = withAllExtensions({
    exportPathMap() {
        return {
            '/': { page: '/home' }
        };
    }
});
