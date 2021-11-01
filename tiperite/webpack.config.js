const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  if (config.mode == 'development') config.devServer.compress = false;

  // Remove hash from name
  config.output.filename = 'app.js';

  // Prevent code splitting
  config.plugins.push(
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  );
  config.optimization.splitChunks = {
    cacheGroups: {
      default: false,
    },
  };
  config.optimization.runtimeChunk = false;

  return config;
};
