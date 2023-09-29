module.exports = {
  preset: "jest-preset-stylelint",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  testEnvironment: "node",
};
