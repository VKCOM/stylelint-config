module.exports = {
  preset: "jest-preset-stylelint",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  testEnvironment: "node",
  // см. https://jestjs.io/ru/docs/ecmascript-modules
  extensionsToTreatAsEsm: [".ts"],
};
