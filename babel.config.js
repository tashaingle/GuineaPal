module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', {
        jsxRuntime: 'automatic'
      }]
    ],
    plugins: [
      ['module-resolver', {
        root: ['./'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@assets': './assets',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@utils': './src/utils',
          '@types': './src/types',
          '@constants': './src/constants',
        }
      }],
      'react-native-reanimated/plugin',
      ['@babel/plugin-transform-react-jsx', {
        runtime: 'automatic'
      }],
      '@babel/plugin-transform-export-namespace-from',
      '@babel/plugin-transform-optional-chaining',
      '@babel/plugin-transform-nullish-coalescing-operator',
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: true,
        allowUndefined: true
      }],
      ['transform-inline-environment-variables', {
        include: ['EXPO_OS', 'NODE_ENV', 'EXPO_PLATFORM']
      }]
    ],
    env: {
      development: {
        compact: false,
        plugins: [
          ['transform-inline-environment-variables', {
            include: ['EXPO_OS', 'NODE_ENV', 'EXPO_PLATFORM']
          }]
        ]
      },
      production: {
        compact: true,
        plugins: [
          ['transform-inline-environment-variables', {
            include: ['EXPO_OS', 'NODE_ENV', 'EXPO_PLATFORM']
          }]
        ]
      }
    }
  };
};