const createExtension = require('./utils/create-extension');

module.exports = createExtension({
    webpack(config, options) {
        for (const r of config.module.rules) {
            if ([r.loader, r.use].includes(options.defaultLoaders.babel)) {
                r.test = /\.(js|jsx|flow)$/;
            }
        }

        return config;
    }
});
