import { Node } from 'postcss';

export function resolveNestedSelector(selector: string, node: Node): string[] {
  const parent = node.parent;
  if (!parent) {
    return [selector];
  }
  const parentIsNestAtRule = parent.type === 'atrule' && (parent as any).name === 'nest';

  if (parent.type === 'root') return [selector];
  if (parent.type !== 'rule' && !parentIsNestAtRule) return resolveNestedSelector(selector, parent);

  const parentSelectors: string[] = parentIsNestAtRule
    ? (parent as any).params.split(',').map((s: string) => s.trim())
    : (parent as any).selectors;

  return parentSelectors.reduce<string[]>((result, parentSelector) => {
    if (selector.indexOf('&') !== -1) {
      const newlyResolvedSelectors = resolveNestedSelector(parentSelector, parent).map(
        function (resolvedParentSelector) {
          return selector.replace(/&/g, resolvedParentSelector);
        }
      );
      return result.concat(newlyResolvedSelectors);
    }

    const combinedSelector = [parentSelector, selector].join(' ');
    return result.concat(resolveNestedSelector(combinedSelector, parent));
  }, []);
}
