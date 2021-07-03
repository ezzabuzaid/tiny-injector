module.exports = {
    "roots": [
        "<rootDir>/__test__"
    ],
    "testMatch": [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "clearMocks": true,
    "resetMocks": true,
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json'
        }
    }
}