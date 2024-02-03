module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  plugins: ['react-hooks', 'use-effect-no-deps', 'boundaries'],
  extends: [
    'eslint:recommended',
    'react-app',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@babel/eslint-parser',
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        'react-app',
        'airbnb',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: './',
        project: './tsconfig.json',
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
          },
        },
        'boundaries/elements': [
          {
            type: 'shared',
            pattern: 'shared/*',
          },
          {
            type: 'entities',
            pattern: 'entities/*',
          },
          {
            type: 'features',
            pattern: 'features/*',
          },
          {
            type: 'widgets',
            pattern: 'widgets/*',
          },
          {
            type: 'pages',
            pattern: 'pages/*',
          },
          {
            type: 'processes',
            pattern: 'processes/*',
          },
          {
            type: 'app',
            pattern: 'app/*',
          },
        ],
      },
      rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',
        'boundaries/no-private': 'error',
        'boundaries/no-unknown': 'error',
        'boundaries/element-types': [
          2,
          {
            default: 'disallow',
            message: '${file.type} is not allowed to import ${dependency.type}',
            rules: [
              {
                from: 'shared',
                allow: [],
                message:
                  'Do not import ${report.specifiers} from ${dependency.source} in helpers',
              },
              {
                from: 'entities',
                allow: ['shared'],
              },
              {
                from: 'features',
                allow: ['shared', 'entities'],
              },
              {
                from: 'widgets',
                allow: ['shared', 'entities', 'features'],
              },
              {
                from: 'pages',
                allow: ['shared', 'entities', 'features', 'widgets'],
              },
              {
                from: 'processes',
                allow: ['shared', 'entities', 'features', 'widgets', 'pages'],
              },
              {
                from: 'app',
                allow: [
                  'shared',
                  'entities',
                  'features',
                  'widgets',
                  'pages',
                  'processes',
                ],
              },
            ],
          },
        ],
        'use-effect-no-deps/use-effect-no-deps': 'warn',
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/strict-boolean-expressions': 'error',
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          {
            assertionStyle: 'never',
          },
        ],
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
            'newlines-between': 'always',
          },
        ],
        'import/max-dependencies': [
          'error',
          {
            max: 30,
            ignoreTypeImports: false,
          },
        ],
        'no-console': 'off',
        radix: 'error',
        'react/require-default-props': 'off',
        'no-underscore-dangle': 'off',
        camelcase: 'off',
        'jsx-a11y/label-has-associated-control': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-param-reassign': [
          'error',
          {
            props: true,
            ignorePropertyModificationsFor: ['state'],
          },
        ],
        'react/jsx-filename-extension': [
          1,
          {
            extensions: ['.tsx'],
          },
        ],
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            ts: 'never',
            tsx: 'never',
          },
        ],
        'max-lines': 1,
        'max-len': [1, 140, 2],
        'react/jsx-props-no-spreading': 'off',
        indent: 'off',
        '@typescript-eslint/indent': 'off',
      },
    },
  ],
};
