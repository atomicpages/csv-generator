module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "mocha": true
    },
    "plugins": [
        "chai-expect",
        "mocha",
        "promise"
    ],
    "extends": "eslint:recommended",
    "parserOptions": { "sourceType": "module" },
    "rules": {
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "linebreak-style": ["error", "unix"],
        "semi": ["error", "always"],
        "block-scoped-var": ["error"],
        "class-methods-use-this": ["error"],
        "curly": ["error", "all"],
        "dot-location": ["error", "object"],
        "dot-notation": ["error", { "allowKeywords": false }],
        "eqeqeq": ["error", "always"],
        "no-else-return": ["error"],
        "no-eval": ["error"],
        "no-extra-bind": ["error"],
        "no-floating-decimal": ["error"], // 0.7, not .7
        "no-global-assign": ["error"],
        "no-implied-eval": ["error"],
        "no-invalid-this": ["error"],
        "no-labels": ["error"],
        "no-lone-blocks": ["error"],
        "no-loop-func": ["error"],
        "no-multi-spaces": ["error"],
        "no-multi-str": ["error"], // use template literals https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
        "no-new-func": ["error"],
        "no-return-assign": ["error", "always"],
        "no-proto": ["error"], // use getPrototypeOf()
        "no-script-url": ["error"], // http://stackoverflow.com/questions/13497971/what-is-the-matter-with-script-targeted-urls
        "no-sequences": ["error"],
        "no-throw-literal": ["error"], // use throw new Error('message')
        "no-useless-call": ["error"],
        "no-useless-concat": ["error"],
        "no-useless-escape": ["error"],
        "no-useless-return": ["error"],
        "no-shadow": ["error"],
        "no-new-require": ["error"],
        "no-use-before-define": ["error"],
        "array-bracket-spacing": ["error", "never"],
        "block-spacing": ["error", "always"],
        "brace-style": ["error", "1tbs"],
        "comma-dangle": ["error", "never"],
        "comma-spacing": ["error", {
            "before": false,
            "after": true
        }],
        "no-case-declarations": 0,
        "consistent-this": ["error", "self"],
        "eol-last": ["error", "always"],
        "func-call-spacing": ["error", "never"],
        "key-spacing": ["error", {
            "beforeColon": false,
            "afterColon": true
        }],
        "keyword-spacing": ["error", {
            "before": true,
            "after": true
        }],
        "new-parens": ["error"],
        "newline-before-return": ["error"],
        "no-array-constructor": ["error"],
        "no-lonely-if": ["error"],
        "no-multiple-empty-lines": ["error", { "max": 2, "maxBOF": 0, "maxEOF": 1 }],
        "no-nested-ternary": ["error"],
        "no-new-object": ["error"],
        "no-trailing-spaces": ["error"],
        "no-unneeded-ternary": ["error"],
        "no-whitespace-before-property": ["error"],
        "operator-assignment": ["error", "always"],
        "padded-blocks": ["error", {
            "classes": "always",
            "blocks": "never",
            "switches": "never"
        }],
        "quotes": ["error", "single"],
        "space-before-blocks": ["error", "always"],
        "space-before-function-paren": ["error", {
            "anonymous": "always",
            "named": "never",
            "asyncArrow": "ignore"
        }],
        "space-infix-ops": ["error", { "int32Hint": false }],
        "space-unary-ops": [1, {
            "words": true,
            "nonwords": false
        }],
        "unicode-bom": ["error", "never"],
        "arrow-body-style": ["error", "as-needed"],
        "arrow-parens": ["error", "as-needed"],
        "arrow-spacing": ["error", {
            "before": true,
            "after": true
        }],
        "generator-star-spacing": ["error", {
            "before": true,
            "after": false
        }],
        "no-class-assign": ["error"],
        "no-console": ["off"],
        "no-useless-computed-key": ["error"],
        "no-useless-rename": ["error"],
        "no-var": ["error"]
    }
};
