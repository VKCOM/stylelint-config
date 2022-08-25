import { Rule } from 'postcss';
import { shouldIgnoreCustomProperty } from './should-ignore-custom-property';
import stylelint, { PostcssResult } from 'stylelint';
import { ruleName } from '../index';

interface Config {
  rule: Rule;
  componentName: string;
  result: PostcssResult;
  ignorePattern?: RegExp;
}

export function validateCustomProperties(config: Config) {
  config.rule.walkDecls(declaration => {
    const property = declaration.prop;

    if (property.indexOf('--') !== 0) return;

    if (shouldIgnoreCustomProperty(property, declaration, config.ignorePattern))
      return;

    if (property.indexOf(`${config.componentName}-`) === 2) return;

    stylelint.utils.report({
      ruleName,
      message: `Invalid custom property name "${property}": a component's custom properties must start with the component name`,
      node: declaration,
      result: config.result,
    });
  });
}
