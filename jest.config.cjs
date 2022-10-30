/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.ts'],
  preset: 'ts-jest',

  // Support ES Modules
  // https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/
  // https://jestjs.io/docs/ecmascript-modules
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};
