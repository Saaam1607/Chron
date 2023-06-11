module.exports = {
    setupFiles:["<rootDir>/.jest/setEnvVars.js"],
    "verbose": true,
    "collectCoverage": true,
    "detectOpenHandles": true,

    "coverageDirectory": "coverage",
    "coverageReporters": ["text", "html"],
    "testEnvironment": "node",
}