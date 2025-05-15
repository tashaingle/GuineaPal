const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);


config.resolver = {
  ...config.resolver,
 
  sourceExts: [...config.resolver.sourceExts, 'mjs', 'cjs', 'svg'],
 
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),

  unstable_enableSymlinks: false,
  
  unstable_enablePackageExports: true,
  
  extraNodeModules: new Proxy({}, {
    get: (target, name) => path.join(__dirname, `node_modules/${name}`)
  })
};


config.transformer = {
  ...config.transformer,
  
  enableBabelRuntime: true,
 
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
 
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true
    }
  }
};


config.watchFolders = [
  ...config.watchFolders,
 
];


config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
    
      if (req.url.startsWith('/redirect')) {
        res.writeHead(302, { Location: '/new-location' });
        res.end();
        return;
      }
      return middleware(req, res, next);
    };
  },
  
  rewriteRequestUrl: (url) => {
    
    if (url.startsWith('/api')) {
      return url.replace('/api', '/custom-api');
    }
    return url;
  }
};


config.cacheStores = [
 
];

module.exports = config;