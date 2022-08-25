export interface PresetOptions {
  namespace?: string;
}

interface PresetPattern {
  componentName: RegExp;
  componentSelectors: (componentName: string, presetOptions: PresetOptions) => RegExp;
  utilitySelectors?: RegExp;
}

export const presetPatterns: Record<string, PresetPattern> = {
  suit: {
    componentName: /^[A-Z][a-zA-Z0-9]+$/,
    componentSelectors: suitSelector,
    utilitySelectors: /^\.u-(sm-|md-|lg-)?(?:[a-z0-9][a-zA-Z0-9]*)+$/,
  },
  bem: {
    componentName: /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/,
    componentSelectors: bemSelector,
  },
} as const;

function suitSelector(componentName: string, presetOptions: PresetOptions): RegExp {
  const ns =
    presetOptions && presetOptions.namespace
      ? `${presetOptions.namespace}-`
      : '';
  const WORD = '[a-z0-9][a-zA-Z0-9]*';
  const descendant = `(?:-${WORD})?`;
  const modifier = `(?:--${WORD}(?:\\.${ns}${componentName}${descendant}--${WORD})*)?`;
  const attribute = '(?:\\[.+\\])?';
  const state = `(?:\\.is-${WORD})*`;
  const body = descendant + modifier + attribute + state;
  return new RegExp(`^\\.${ns}${componentName}\\b${body}$`);
}

function bemSelector(block: string, presetOptions: PresetOptions): RegExp {
  const ns =
    presetOptions && presetOptions.namespace
      ? `${presetOptions.namespace}-`
      : '';
  const WORD = '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*';
  const element = `(?:__${WORD})?`;
  const modifier = `(?:(?:_|--)${WORD}){0,2}`;
  const attribute = '(?:\\[.+\\])?';
  return new RegExp(`^\\.${ns}${block}${element}${modifier}${attribute}$`);
}
