import path from 'path';
import micromatch from 'micromatch';

function minimatchList(path: string, patternList: string[], options?: micromatch.Options) {
  return patternList.some(pattern => micromatch.isMatch(path, pattern, options));
}

/**
 * Check the file matches on of the globs.
 */
function checkGlob(filename: string, globs: string[]) {
  // PostCSS turns relative paths into absolute paths
  filename = path.relative(process.cwd(), filename);
  return minimatchList(filename, globs);
}

/**
 * @param {string[]|boolean} implicitComponentsConfig - The configuration value implicitComponents
 * @param {string} filename - The filename of the CSS file being checked
 */
export function isImplicitComponent(implicitComponentsConfig: string[] | undefined, filename: string) {
  if (Array.isArray(implicitComponentsConfig)) {
    return checkGlob(filename, implicitComponentsConfig);
  }

  return Boolean(implicitComponentsConfig);
}

/**
 * @param {string[]|boolean} implicitUtilitiesConfig - The configuration value implicitUtilities
 * @param {string} filename - The filename of the CSS file being checked
 * @return {boolean}
 */
export function isImplicitUtilities(implicitUtilitiesConfig: string[] | undefined, filename: string) {
  if (Array.isArray(implicitUtilitiesConfig)) {
    return checkGlob(filename, implicitUtilitiesConfig);
  }

  return false;
}
