import { Rule } from 'postcss';
import { IGNORE_COMMENT } from './constants.js';

export function shouldIgnoreRule(rule: Rule) {
  const previousNode = rule.prev();
  return previousNode && previousNode.type === 'comment' && previousNode.text === IGNORE_COMMENT;
}
