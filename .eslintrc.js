module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/recommended',
        'plugin:vue/strongly-recommended',
        '@vue/airbnb',
        '@vue/typescript',
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        indent: ['warn', 4],
        semi: ['warn', 'always'],
        'brace-style': ['warn', 'stroustrup'],
        'no-trailing-spaces': ['warn', { skipBlankLines: false }],
        'no-return-assign': 'off',
        'space-before-function-paren': 'off',
        'padded-blocks': ['warn', { classes: 'always' }],
        'comma-dangle': ['warn', 'always-multiline'],
        'no-useless-constructor': 'off',
        'class-methods-use-this': 'off',
        'max-len': ['warn', 140],
        'no-await-in-loop': 'off',
        'arrow-parens': 'off',
        'no-continue': 'off',
        'global-require': 'off',
        'import/prefer-default-export': 'off',
        'vue/html-indent': ['warn', 4, {
            attribute: 1,
            baseIndent: 1,
            closeBracket: 1,
            alignAttributesVertically: true,
            ignores: [],
        }],
        'vue/max-attributes-per-line': ['warn', {
            singleline: 3,
            multiline: {
                max: 1,
                allowFirstLine: true,
            },
        }],
    },
    parserOptions: {
        parser: 'typescript-eslint-parser',
    },
    plugins: [
        'vue',
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
            },
        },
    },
};
