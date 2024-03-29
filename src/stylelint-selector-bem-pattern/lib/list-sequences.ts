/**
 * Extract an array of selector sequences from a selector string ---
 * all the sequences that were combined via combinators.
 *
 * CSS combinators are " ", >, +, ~
 * (cf. http://www.w3.org/TR/css3-selectors/#selector-syntax)
 *
 * Ignore pseudo-selectors ... by presuming they come at the end of the
 * sequence and cutting them off from the string that gets checked.
 */
export function listSequences(selector: string): string[] {
  const withoutPseudos = selector.split(':')[0];
  return withoutPseudos.split(/[\s>+~]/).filter(s => s !== '');
}
