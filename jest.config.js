module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      isolatedModules: true,
      tsConfig: './tsconfig.test.json'
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
 
  transform: {
    '\\.js$': ['babel-jest', { configFile: './babel-jest.config.js' }],
  },

};
