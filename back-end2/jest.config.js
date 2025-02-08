module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/tests/fixtures/'
    ],
    setupFilesAfterEnv: ['./tests/setup.js'],
    testTimeout: 10000,
    forceExit: true,
    detectOpenHandles: true
}; 