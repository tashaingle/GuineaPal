import { getDefaultConfig } from 'expo/metro-config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = getDefaultConfig(__dirname);


config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};


config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'svg', 'mjs', 'cjs'],
  assetExts: config.resolver.assetExts
    .filter(ext => ext !== 'svg')
    .concat(['png', 'jpg', 'jpeg', 'gif', 'webp', 'heic', 'heif']),
  
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '@assets': path.resolve(__dirname, 'assets'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@screens': path.resolve(__dirname, 'src/screens'),
    '@navigation': path.resolve(__dirname, 'src/navigation'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@types': path.resolve(__dirname, 'src/types'),
    '@constants': path.resolve(__dirname, 'src/constants'),
    '@styles': path.resolve(__dirname, 'src/styles'),
  },
  
  resolverMainFields: ['react-native', 'browser', 'main'],
  disableHierarchicalLookup: false,
};


config.server = {
  ...config.server,
  port: 8081,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url.startsWith('/assets')) {
        req.url = req.url.replace('/assets', '/assets/..');
      }
      return middleware(req, res, next);
    };
  },
};


config.resetCache = process.env.EXPO_NO_CACHE === 'true';

export default config;