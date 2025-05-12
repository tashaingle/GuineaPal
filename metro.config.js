const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);


config.resolver.assetExts = [
  ...config.resolver.assetExts.filter(ext => ext !== 'svg'),
  'db',   
  'ttf',   
  'bin'    
];


config.resolver.sourceExts = [
  'js',
  'jsx',
  'json',
  'ts',
  'tsx'
];

module.exports = config;