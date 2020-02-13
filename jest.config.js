// https://jestjs.io/docs/en/configuration
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  rootDir: '.',
  roots: ['<rootDir>/'], // 多个测试目录
  testRegex: '(/test/.*\\.(test|spec))\\.[tj]sx?$',
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx"
  ],
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>',
  //   '^@bll/(.*)$': '<rootDir>/src/bll',
  //   '^@db/(.*)$': '<rootDir>/src/dal/db',
  //   '^@entity/(.*)$': '<rootDir>/src/dal/db/entity',
  //   '^@repository/(.*)$': '<rootDir>/src/dal/db/repository',
  //   '^@ut/(.*)$': '<rootDir>/src/test',
  // },
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