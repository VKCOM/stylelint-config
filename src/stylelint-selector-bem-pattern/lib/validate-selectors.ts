import { Rule } from 'postcss';
import { listSequences } from './list-sequences';
import { shouldIgnoreRule } from './should-ignore-rule';
import { shouldIgnoreSelector } from './should-ignore-selector';
import { ComponentNameToRegexp, toInterpolatedRegexp } from './to-interpolated-regexp';
import { getSelectors } from './get-selectors';
import { isObject } from './utils';
import stylelint, { PostcssResult } from 'stylelint';
import { ruleName } from '../index';

export interface SelectorPattern {
  initial: ComponentNameToRegexp;
  combined: ComponentNameToRegexp;
}

interface Config {
  rule: Rule;
  componentName: string;
  weakMode: boolean;
  selectorPattern: SelectorPattern | ComponentNameToRegexp;
  selectorPatternOptions: unknown;
  ignorePattern?: RegExp;
  result: PostcssResult;
}

export function validateSelectors(config: Config) {
  if (shouldIgnoreRule(config.rule)) return;
  const rule = config.rule;

  const initialPattern = isObject(config.selectorPattern) &&'initial' in config.selectorPattern
    ? toInterpolatedRegexp(config.selectorPattern.initial)(config.componentName)
    : toInterpolatedRegexp(config.selectorPattern)(config.componentName);

  const combinedPattern = isObject(config.selectorPattern) && 'combined' in config.selectorPattern
    ? toInterpolatedRegexp(config.selectorPattern.combined)(config.componentName)
    : toInterpolatedRegexp(() => initialPattern)(config.componentName);

  const selectors = getSelectors(rule);

  selectors.forEach((selector) => {
    // Don't bother with :root
    if (selector === ':root') return;

    const allSequences = listSequences(selector);
    let sequence;
    for (let i = 0, l = allSequences.length; i < l; i++) {
      if (config.weakMode && i !== 0) return;
      sequence = allSequences[i];
      if (
        config.ignorePattern &&
        shouldIgnoreSelector(sequence, config.ignorePattern)
      )
        continue;
      if (i === 0 && initialPattern.test(sequence)) continue;
      if (i !== 0 && combinedPattern.test(sequence)) continue;

      stylelint.utils.report({
        ruleName,
        message: `Invalid component selector "${selector}"`,
        node: rule,
        word: selector,
        result: config.result,
      });

      return;
    }
  });
}
