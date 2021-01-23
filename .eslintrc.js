module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },

    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },

    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        parser: 'babel-eslint',
    },

    plugins: ['vue'],

    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        semi: [2, 'never'],
        quotes: [2, 'single', { allowTemplateLiterals: true }],
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 'off',
        // no-tabs
        'no-tabs': 'off',
    },

    root: true,
    extends: ['eslint:recommended', 'plugin:vue/essential', '@vue/prettier'],

    extends: ['eslint:recommended', 'plugin:vue/essential', '@vue/prettier'],
}
