import { Declaration } from 'postcss';
import { IGNORE_COMMENT } from './constants.js';

export function shouldIgnoreCustomProperty(
  customProperty: string,
  declaration: Declaration,
  patterns?: RegExp | RegExp[]
) {
  const previousNode = declaration.prev();
  if (previousNode && previousNode.type === 'comment' && previousNode.text === IGNORE_COMMENT) return true;

  if (!patterns) return false;

  return ([] as RegExp[]).concat(patterns).some(p => p.test(customProperty));
}
