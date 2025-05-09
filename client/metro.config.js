/**
 * metro.config.js
 * https://facebook.github.io/metro/docs/configuration
 */

const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();

  return {
    ...defaultConfig,
    transformer: {
      ...defaultConfig.transformer,
      assetRegistryPath: require.resolve(
        'react-native/Libraries/Image/AssetRegistry'
      ),
    },
  };
})();
