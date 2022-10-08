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
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '\\.js$': ['babel-jest', { configFile: './babel-jest.config.js' }],
  },

 moduleNameMapper: {
    '@darwinia/xquery-type(.*)$': '<rootDir>/packages/types/src/$1'
  },
 modulePaths: [
        '<rootDir>'
    ],

 "transformIgnorePatterns": [
    "node_modules/(?!(@polkadot|@babel/runtime/helpers/esm)/)"
  ],

};
