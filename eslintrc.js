module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
    "jest/globals": true
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "allowImportExportEverywhere": true
  },
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@next/next/recommended",
    "plugin:github/recommended"
  ],
  settings: {
    react: {
      version: 'latest',
    },
  },
  plugins: ['github', 'jest', 'simple-import-sort'],
  "ignorePatterns": ["jest.config.js"],
  rules: {
    'max-len': [2, { code: 120, tabWidth: 4, ignoreUrls: true }],
    indent: [
      'error',
      2,
      {
        "ignoredNodes": ["TemplateLiteral"]
      }
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    'eslint-comments/no-use': 0,
    'simple-import-sort/imports': "error",
    'simple-import-sort/exports': "error",
    'sort-imports': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'import/no-commonjs': 0,
    '@next/next/no-img-element': 0
  },
};

