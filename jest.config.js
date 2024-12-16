module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],  
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  }
};
