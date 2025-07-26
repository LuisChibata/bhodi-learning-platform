import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                fetch: 'readonly',
                localStorage: 'readonly',
                CodeMirror: 'readonly',
                alert: 'readonly',
                confirm: 'readonly',
                prompt: 'readonly',
                setTimeout: 'readonly',
                setInterval: 'readonly',
                clearTimeout: 'readonly',
                clearInterval: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'error',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'no-console': 'off',
            'no-alert': 'warn',
            'max-len': ['warn', { code: 100 }],
            'prefer-const': 'warn',
            'no-var': 'warn'
        },
        files: ['src/frontend/js/**/*.js'],
        ignores: [
            'node_modules/**',
            'tests/**',
            'htmlcov/**',
            '.pytest_cache/**',
            'coverage/**'
        ]
    }
];