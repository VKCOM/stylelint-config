import stylelint, { Rule } from 'stylelint';
import { process, BemOptions } from './process';
import { isRegExp } from './lib/utils';

function isString(object: any): boolean {
  return typeof object === 'string';
}

function isFunction(object: any): boolean {
  return typeof object === 'function';
}

function isStringOrRegExp(object: any): boolean {
  return isString(object) || isRegExp(object);
}

function isStringOrFunction(object: any): boolean {
  return isString(object) || isFunction(object);
}

function isBoolean(object: any): boolean {
  return typeof object === 'boolean';
}

const optionsSchema: any = {
  preset: ['suit', 'bem'],
  presetOptions: function() { return true; },
  componentName: [isStringOrRegExp],
  componentSelectors: [(pattern: any) => {
    if (isStringOrFunction(pattern)) return true;
    if (!pattern.initial) return false;
    if (!isStringOrFunction(pattern.initial)) return false;
    if (pattern.combined && !isStringOrFunction(pattern.combined)) return false;
    return true;
  }],
  implicitComponents: [isBoolean, isString, function(pattern: any) {
    return Array.isArray(pattern) && pattern.every(isString);
  }],
  implicitUtilities: [isBoolean, isString, function(pattern: any) {
    return Array.isArray(pattern) && pattern.every(isString);
  }],
  utilitySelectors: [isStringOrRegExp],
  ignoreSelectors: [
    isStringOrRegExp,
    function(pattern: any) {
      if (!Array.isArray(pattern)) {
        return isStringOrRegExp(pattern);
      }
      return pattern.every(isStringOrRegExp);
    },
  ],
  ignoreCustomProperties: [
    isStringOrRegExp,
    function(pattern: any) {
      if (!Array.isArray(pattern)) {
        return isStringOrRegExp(pattern);
      }
      return pattern.every(isStringOrRegExp);
    },
  ],
};

export const ruleName = 'plugin/selector-bem-pattern';
const messages = stylelint.utils.ruleMessages(ruleName, {});

const ruleFunction: Rule<BemOptions> = (primaryOption) => {
  return (root, result) => {
    const isValid = stylelint.utils.validateOptions(
      result,
      ruleName,
      {
        actual: primaryOption,
        possible: optionsSchema,
      }
    );

    if (!isValid) {
      return;
    }

    process(primaryOption, root, result);
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
