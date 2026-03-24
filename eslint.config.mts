import js from '@eslint/js';
import globals from 'globals';
import tseslint, { plugin } from 'typescript-eslint';

export default [
   {
    languageOptions: {
        globals: globals.node
    }
   },
   js.configs.recommended,
   ...tseslint.configs.recommended,
   {
    ignores:['./gen/*.{js,ts}',],
    files: ['**/*.{mjs,js,ts}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrors:'all',
          caughtErrorsIgnorePattern:'îgnore',
          ignoreRestSiblings: true
        }
      ],
      'eol-last': 'error',
      indent: [
        'error',
        4,
        {
          SwitchCase: 1
        }
      ],
      'max-len': [ 'error',120 ],
      'max-lines-per-function': ['error',30],
      'object-curly-spacing': ['error', 'always'],
      quotes: ['error', 'single'],
      'quote-props': ['error','as-needed'],
      semi: ['error','always'],
      'sort-imports':[
        'error',
        {
          memberSyntaxSortOrder: ['single','all','multiple','none'],
          allowSeparatedGroups: true
        }
      ]
    }
   }
]