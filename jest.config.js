module.exports = {
    'projects': [
        {
            'displayName': 'test',
            'moduleFileExtensions': [
                'js',
                'json',
                'sfc'
            ],
            'transform': {
                '^.+\\.sht$': 'sham-ui-jest-preprocessor',
                '^.+\\.sfc$': 'sham-ui-jest-preprocessor',
                '^.+\\.js$': 'babel-jest'
            },
            'collectCoverageFrom': [
                'src/**/*.js'
            ],
            'coveragePathIgnorePatterns': [
                '^.+\\.sht$',
                '<rootDir>/.babel-plugin-macrosrc.js'
            ],
            'testPathIgnorePatterns': [
                '<rootDir>/node_modules/',
                '<rootDir>/__tests__/setup-jest.js'
            ],
            'setupTestFrameworkScriptFile': '<rootDir>/__tests__/setup-jest.js',
            'testURL': 'http://sham-ui-dynamic-component.example.com'
        },
        {
            'runner': 'jest-runner-eslint',
            'displayName': 'eslint',
            'moduleFileExtensions': [
                'js',
                'json',
                'sfc'
            ],
            'testMatch': [
                '<rootDir>/src/**/*.*',
                '<rootDir>/__tests__/**/*.js',
                '<rootDir>/__mocks__/**/*.js',
                '<rootDir>/demo-app/**/*.js'
            ],
            'testPathIgnorePatterns': [
                '<rootDir>/demo-app/dist'
            ]
        },
        {
            'runner': 'jest-runner-stylelint',
            'displayName': 'stylelint',
            'moduleFileExtensions': [
                'scss'
            ],
            'testMatch': [
                '**/*.scss'
            ]
        }
    ]
};
