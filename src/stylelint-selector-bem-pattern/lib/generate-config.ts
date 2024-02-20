import { PresetOptions, presetPatterns } from './preset-patterns.js';
import { SelectorPattern } from './validate-selectors.js';

export interface BemOptions {
  preset?: 'bem' | 'suit';
  implicitComponents?: string | string[];
  implicitUtilities?: string | string[];
  componentName?: RegExp;
  utilitySelectors?: string | RegExp;
  componentSelectors?: SelectorPattern;
  presetOptions?: PresetOptions;
  ignoreSelectors?: RegExp;
  ignoreCustomProperties?: RegExp;
}

export function generateConfig(primaryOptions: BemOptions) {
  let patterns = presetPatterns[primaryOptions.preset ?? 'suit'] ?? presetPatterns['suit'];

  const allPatterns = {
    ...patterns,
    ...{
      utilitySelectors: primaryOptions.utilitySelectors,
      componentName: primaryOptions.componentName,
      componentSelectors: primaryOptions.componentSelectors,
      ignoreSelectors: primaryOptions.ignoreSelectors,
      ignoreCustomProperties: primaryOptions.ignoreCustomProperties,
    },
  };

  return {
    patterns: allPatterns,
    presetOptions: primaryOptions.presetOptions || {},
    componentNamePattern: allPatterns.componentName || /^[-_a-zA-Z0-9]+$/,
    implicitComponents: getImplicitDefineValue(primaryOptions.implicitComponents),
    implicitUtilities: getImplicitDefineValue(primaryOptions.implicitUtilities),
  };
}

function getImplicitDefineValue(value: string | string[] | undefined) {
  if (typeof value === 'string') {
    return [value];
  }

  return value;
}
