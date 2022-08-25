import { Rule } from 'postcss';
import { resolveNestedSelector } from './resolve-nested-selector';

function isNestedRule(node: Rule): boolean {
  return node.parent ? /(?:at)?rule/.test(node.parent.type) : false;
}

function hasChildNodes(node: Rule) {
  return node.nodes && node.nodes.length;
}

function hasNoDeclarations(node: Rule) {
  return hasChildNodes(node) && node.every(child => child.type !== 'decl');
}

function hasOnlyAllowedAtRules(node: Rule) {
  let containsAllowed = false;
  let containsNotAllowed = false;

  if (hasChildNodes(node)) {
    node.each((child) => {
      if (
        child.type === 'atrule' &&
        (child.name === 'extend' || child.name === 'media')
      ) {
        containsAllowed = true;
      } else if (child.type !== 'comment') {
        containsNotAllowed = true;
      }
    });
  }
  return containsAllowed && !containsNotAllowed;
}

function unWrapSelectors(rule: Rule) {
  let selectors: string[] = [];
  rule.selectors.forEach(selector => {
    selectors.push(selector);
    selectors = selectors.concat(resolveNestedSelector(selector, rule));
  });
  return selectors;
}

export function getSelectors(rule: Rule) {
  // Skip validation on rules with no declarations
  // as these don't exist after rules have been unwrapped (unless the selector contains only a @extend or @media)
  if (hasNoDeclarations(rule) && !hasOnlyAllowedAtRules(rule)) {
    return [];
  }

  if (isNestedRule(rule)) {
    return unWrapSelectors(rule);
  }

  return rule.selectors;
}
