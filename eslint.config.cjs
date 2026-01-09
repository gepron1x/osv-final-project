const {
    defineConfig,
} = require("eslint/config");

module.exports = defineConfig([{
    languageOptions: {
        globals: {},
        ecmaVersion: 2017,
        sourceType: "script",
    },

    rules: {
        indent: "error",
        "space-before-blocks": "error",
        "keyword-spacing": "error",
        "space-infix-ops": "error",
        "space-in-parens": "error",
        "brace-style": "error",
        "comma-spacing": "error",
        "array-bracket-spacing": "error",
        "no-multi-spaces": "error",
        "no-multiple-empty-lines": "error",
        "computed-property-spacing": "error",
        "func-call-spacing": "error",

        "max-len": ["warn", {
            code: 80,
        }],

        semi: "error",
        "no-use-before-define": "error",
        "no-array-constructor": "error",
    },
}]);