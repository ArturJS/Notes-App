const path = require('path');
const tsConfig = require('./tsconfig.json');

const tsPathsToAlias = (tsPaths) => {
  const noAsterisk = item => item.replace('/*', '');
  const result = Object.entries(tsPaths)
      .reduce((acc, [key, value]) => {
          acc[noAsterisk(key)] = path.resolve(__dirname, noAsterisk(value[0]));

          return acc;
      }, {});

  return result;
};

module.exports = {
  webpack(config) {
    Object.assign(config.resolve.alias, tsPathsToAlias(tsConfig.paths));
    return config;
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  }
};
