const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Proxy any /api requests to your backend
  config.devServer = {
    ...config.devServer,
    proxy: {
      '/api': {
        target: 'http://localhost:7023',
        changeOrigin: true,
        secure: false,
      },
    },
  };

  return config;
};
