module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  rules: {
    "prefer-const": "error",
    "no-var": "error"
  }
};
