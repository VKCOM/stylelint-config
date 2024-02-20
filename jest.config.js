import fs from 'node:fs';
import process from 'node:process';

export default {
  preset: 'jest-preset-stylelint',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testEnvironment: 'node',
  // см. https://jestjs.io/ru/docs/ecmascript-modules
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
