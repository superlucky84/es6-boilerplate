module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['tui', 'plugin:prettier/recommended'],
  plugins: [],
  // add your custom rules here
  rules: {
    indent: [2, 2, {SwitchCase: 1, ignoreComments: false, ImportDeclaration: 1, flatTernaryExpressions: false}],
    'require-jsdoc': 0
  }
};
