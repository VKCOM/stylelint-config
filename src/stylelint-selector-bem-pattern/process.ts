import path from 'path';
import { AtRule, Root, Rule } from 'postcss';
import { validateCustomProperties } from './lib/validate-custom-properties.js';
import { validateUtilities } from './lib/validate-utilities.js';
import { validateSelectors } from './lib/validate-selectors.js';
import { BemOptions, generateConfig } from './lib/generate-config.js';
import { toRegexp } from './lib/to-regexp.js';
import { isImplicitComponent, isImplicitUtilities } from './lib/check-implicit.js';
import stylelint, { PostcssResult } from 'stylelint';
import { ruleName } from './index.js';

export { BemOptions };

const DEFINE_VALUE = '([-_a-zA-Z0-9]+)\\s*(?:;\\s*(weak))?';
const DEFINE_DIRECTIVE = new RegExp(
  `(?:\\*?\\s*@define ${DEFINE_VALUE})|(?:\\s*postcss-bem-linter: define ${DEFINE_VALUE})\\s*`
);
const END_DIRECTIVE = new RegExp('(?:\\*\\s*@end\\s*)|' + '(?:\\s*postcss-bem-linter: end)\\s*');
const UTILITIES_IDENT = 'utilities';
const WEAK_IDENT = 'weak';

function stripUnderscore(str: string) {
  return str.replace(/^_/, '');
}

export function process(opts: BemOptions, root: Root, result: PostcssResult) {
  const config = generateConfig(opts);
  const patterns = config.patterns;

  type FileRange = {
    defined: string;
    start: number;
    weakMode: boolean;
    end?: number;
  };

  const ranges = findRanges(root);

  root.walkRules(rule => {
    if (rule.parent && (rule.parent as AtRule).name === 'keyframes') return;
    if (!rule.source) {
      return;
    }

    const ruleStartLine = rule.source?.start?.line;
    ranges.forEach(range => {
      if (ruleStartLine == null || ruleStartLine < range.start) {
        return;
      }
      if (range.end && ruleStartLine > range.end) {
        return;
      }
      checkRule(rule, range);
    });
  });

  function checkRule(rule: Rule, range: FileRange) {
    if (range.defined === UTILITIES_IDENT) {
      if (!patterns.utilitySelectors) {
        throw new Error('You tried to `@define utilities` but have not provided ' + 'a `utilitySelectors` pattern');
      }
      validateUtilities({
        rule,
        utilityPattern: toRegexp(patterns.utilitySelectors),
        ignorePattern: patterns.ignoreSelectors ? toRegexp(patterns.ignoreSelectors) : undefined,
        result,
      });
      return;
    }

    if (!patterns.componentSelectors) {
      throw new Error('You tried to `@define` a component but have not provided ' + 'a `componentSelectors` pattern');
    }

    validateCustomProperties({
      rule,
      componentName: range.defined,
      result,
      ignorePattern: patterns.ignoreCustomProperties ? toRegexp(patterns.ignoreCustomProperties) : undefined,
    });
    validateSelectors({
      rule,
      componentName: range.defined,
      weakMode: range.weakMode,
      selectorPattern: patterns.componentSelectors,
      selectorPatternOptions: config.presetOptions,
      ignorePattern: patterns.ignoreSelectors ? toRegexp(patterns.ignoreSelectors) : undefined,
      result,
    });
  }

  function findRanges(root: Root) {
    const ranges: FileRange[] = [];

    if (root.source && root.source.input && root.source.input.file) {
      const filename = root.source.input.file;
      if (isImplicitUtilities(config.implicitUtilities, filename)) {
        ranges.push({
          defined: 'utilities',
          start: 0,
          weakMode: false,
        });
      } else if (isImplicitComponent(config.implicitComponents, filename)) {
        let defined = stripUnderscore(path.basename(filename).split('.')[0]);
        if (defined === 'index') {
          defined = path.basename(path.join(filename, '..'));
        }

        if (defined !== UTILITIES_IDENT && !toRegexp(config.componentNamePattern).test(defined)) {
          stylelint.utils.report({
            ruleName,
            message: `Invalid component name from implicit conversion from filename ${filename}`,
            node: root,
            result: result as PostcssResult,
          });
        }

        ranges.push({
          defined,
          start: 0,
          weakMode: false,
        });
      }
    }

    root.walkComments(comment => {
      const commentStartLine = comment.source ? comment.source?.start?.line : null;
      if (!commentStartLine) return;

      if (END_DIRECTIVE.test(comment.text)) {
        endCurrentRange(commentStartLine);
        return;
      }

      const directiveMatch = comment.text.match(DEFINE_DIRECTIVE);
      if (!directiveMatch) return;
      const defined = (directiveMatch[1] || directiveMatch[3]).trim();
      if (defined !== UTILITIES_IDENT && !toRegexp(config.componentNamePattern).test(defined)) {
        stylelint.utils.report({
          ruleName,
          message: `Invalid component name in definition /*${comment}*/`,
          node: comment,
          result: result as PostcssResult,
        });
      }

      endCurrentRange(commentStartLine);
      ranges.push({
        defined,
        start: commentStartLine,
        weakMode: directiveMatch[2] === WEAK_IDENT,
      });
    });
    return ranges;

    function endCurrentRange(line: number) {
      const range = ranges[ranges.length - 1];
      if (!range || range.end) {
        return;
      }
      range.end = line;
    }
  }
}
