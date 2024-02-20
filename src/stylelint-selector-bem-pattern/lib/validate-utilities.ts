import { listSequences } from './list-sequences.js';
import { shouldIgnoreRule } from './should-ignore-rule.js';
import { shouldIgnoreSelector } from './should-ignore-selector.js';
import { getSelectors } from './get-selectors.js';
import { Rule } from 'postcss';
import stylelint, { PostcssResult } from 'stylelint';
import { ruleName } from '../index.js';

interface Config {
  rule: Rule;
  utilityPattern: RegExp;
  ignorePattern?: RegExp;
  result: PostcssResult;
}

export function validateUtilities(config: Config) {
  if (shouldIgnoreRule(config.rule)) {
    return;
  }
  const selectors = getSelectors(config.rule);

  selectors.forEach(selector => {
    const allSequences = listSequences(selector);
    for (const sequence of allSequences) {
      if (config.ignorePattern && shouldIgnoreSelector(sequence, config.ignorePattern)) {
        continue;
      }

      if (config.utilityPattern.test(sequence)) {
        continue;
      }

      stylelint.utils.report({
        ruleName,
        message: `Invalid utility selector "${selector}"`,
        node: config.rule,
        word: selector,
        result: config.result,
      });

      return;
    }
  });
}
