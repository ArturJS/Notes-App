const path = require('path');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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

module.exports = withPWA({
  webpack(config) {
    Object.assign(config.resolve.alias, tsPathsToAlias(tsConfig.compilerOptions.paths));

    config.plugins.push(
      new CopyWebpackPlugin({
          patterns: [
              {
                  from: path.resolve(__dirname, './src/public'),
                  to: path.resolve(__dirname, './public')
              }
          ]
      }),
    );

    return config;
  },
  pageExtensions: ['page.tsx', 'api.ts'],
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  },
  pwa: {
    dest: 'public',
    runtimeCaching,
  },
});
