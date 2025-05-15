const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');


const config = getDefaultConfig(__dirname);


config.resolver = {
  ...config.resolver,
  
  sourceExts: [...config.resolver.sourceExts, 'mjs', 'cjs'],
  
  unstable_enableSymlinks: false,
  
  unstable_enablePackageExports: true,
 
};


config.serializer = {
  ...config.serializer,
 
  customSerializer: () => {},
 
  experimentalSerializerHook: () => {},
};


config.transformer = {
  ...config.transformer,
 
  enableBabelRuntime: true,
  
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};


config.watchFolders = [
  ...config.watchFolders,
 
];


config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      
      return middleware(req, res, next);
    };
  },
};

module.exports = config;