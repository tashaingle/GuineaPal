module.exports = {
  extends: [
    'expo',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'react-native/no-raw-text': 'off',
    'react/react-in-jsx-scope': 'off'
  }
};