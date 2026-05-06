/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['import'],
  extends: ['eslint:recommended', 'plugin:import/recommended'],
  rules: {
    'import/extensions': ['error', 'ignorePackages', { js: 'always' }],
  },
  overrides: [
    {
      files: ['scripts/**/*.mjs'],
      rules: {
        'import/extensions': 'off',
      },
    },
  ],
};
