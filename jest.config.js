// https://jestjs.io/docs/en/configuration
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  rootDir: './',
  roots: ['<rootDir>/src/'], // 多个测试目录
  testRegex: '(/test/.*\\.(test|spec))\\.[tj]sx?$',
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx"
  ],
  moduleNameMapper: {
    '^@root(.*)$': '<rootDir>$1',
    '^@src(.*)$': '<rootDir>/src$1',
    '^@util(.*)$': '<rootDir>/src/util$1',
    '^@bll(.*)$': '<rootDir>/src/bll$1',
    '^@dal(.*)$': '<rootDir>/src/dal$1',
    '^@ext(.*)$': '<rootDir>/src/ext$1',
    '^@ut(.*)$': '<rootDir>/src/test$1',
  },
  collectCoverage: false,
  collectCoverageFrom: [
    "**/src/**/*.ts",
    "!**/node_modules/**"
  ],
  coveragePathIgnorePatterns: ['node_modules', '<rootDir>/src/test/'],
  coverageReporters: ['text', 'html'],
  coverageDirectory: '<rootDir>/build/coverage/',
  coverageThreshold: {
    './src/**/': {
      branches: 50,
      functions: 60,
      lines: 60,
      statements: -10
    }
  },
  // 是否显示通知，从系统通知中发出
  notify: true,
  /**
   * always, failure, success, change, success-change, failure-change
   */
  notifyMode: 'failure',

};