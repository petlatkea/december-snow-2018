module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
    "rules": {
        "no-console": 0,

        "no-undef": 2,
        "no-var": 2,
        "no-unused-vars": [1, {"vars": "all", "args": "none"}],
        "no-use-before-define": 0,
        "func-call-spacing": 2,
        "semi": 2,
        "no-empty": 1,
        "no-constant-condition": 1,
        "no-unsafe-negation": 1,

        // http://eslint.org/docs/rules/#best-practices
        "curly": 2,
        // ===
        "eqeqeq": [2, "smart"],

        "no-alert": 1,
        "no-else-return": 1,
        "no-empty-function": 2,
        "no-implicit-coercion": 2,

        "no-implied-eval": 2,
        "no-invalid-this": 0,
        "no-lone-blocks": 2,

        "no-loop-func": 2,
        "no-multi-str": 2,

        "no-param-reassign": 2,
        "no-redeclare": 2,
        "no-script-url": 2,
        "no-self-assign": 2,
        "no-self-compare": 2,

        "wrap-iife": [2, "outside"],
        // http://eslint.org/docs/rules/#strict-mode
        "strict": 0, // vi bruger ikke strict endnu ...
        // http://eslint.org/docs/rules/#variables
        "no-shadow-restricted-names": 2,
        // giv en fejl, for at hjælpe mod værre fejl!
        "no-shadow": 2,

        // http://eslint.org/docs/rules/#stylistic-issues
        "block-spacing": 1,
        "brace-style": [1, "1tbs", { allowSingleLine: false }],

        "camelcase": 2,
        "comma-dangle": 2,
        "comma-spacing": 0,
        "comma-style": [1, "last"],

        "eol-last": 0,
        "func-call-spacing": 2,
        "indent": [1, 2],
        "max-len": [1, 120],
        "no-bitwise": 2,
        "no-trailing-spaces": 1,
        "semi-spacing": 2
    },
    "globals": {
        "$": false,
        "brackets": false,
        "clearTimeout": false,

        "console": false,
        "alert": false,

        "define": false,
        "require": false,
        "setTimeout": false,

        "window": false,
        "ArrayBuffer": false,
        "Uint32Array": false,
        "WebSocket": false,
        "XMLHttpRequest": false
    }
};
