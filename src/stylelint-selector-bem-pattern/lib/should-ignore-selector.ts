export function shouldIgnoreSelector(selector: string, patterns: RegExp | RegExp[]) {
  if (!patterns) return false;
  return ([] as RegExp[]).concat(patterns).some(p => p.test(selector));
}
