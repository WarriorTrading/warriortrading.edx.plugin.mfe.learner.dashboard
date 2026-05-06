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
  settings: {},
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
    {
      files: ['src/plugins/course-list-alphabetical/CourseListSlotAugment.js'],
      env: { browser: true },
    },
  ],
};
