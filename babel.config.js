module.exports = function(api) {
  api.cache(true);

  const isProduction = api.env('production');
  const isDevelopment = api.env('development');

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          jsxRuntime: 'automatic',
          web: { disableImportExportTransform: true },
          
          disableImportExportTransform: false,
          unstable_transformProfile: 'default'
        }
      ]
    ],
    plugins: [
      
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.android.js',
            '.android.tsx',
            '.ios.js',
            '.ios.tsx'
          ],
          alias: {
            '^@/(.+)': './src/\\1',
            '@assets': './assets',
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@utils': './src/utils',
            '@types': './src/types',
            '@constants': './src/constants'
          }
        }
      ],

      
      'react-native-reanimated/plugin',

      
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: true,
          regenerator: false,
          useESModules: false, 
          absoluteRuntime: false
        }
      ],

      
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      
      
      ['@babel/plugin-proposal-class-properties', { loose: true }],

      
      ...(isDevelopment ? [
        ['@babel/plugin-transform-react-jsx-source', { module: true }],
        '@babel/plugin-transform-react-jsx-self'
      ] : []),

      
      ...(isProduction ? [
        ['transform-remove-console', { exclude: ['error', 'warn'] }],
        'transform-react-remove-prop-types'
      ] : [])
    ].filter(Boolean), 

 
    env: {
      production: {
        compact: true
      },
      development: {
        sourceMaps: 'inline',
        retainLines: true
      }
    }
  };
};