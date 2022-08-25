export function toRegexp(source: string | RegExp | string[]): RegExp {
  if (Array.isArray(source)) {
    return regexpify(source.join('|'));
  }
  return regexpify(source);
}

function regexpify(source: string | RegExp): RegExp {
  if (typeof source === 'string') {
    if (!source.length) {
      throw new Error('You passed an empty pattern');
    }

    try {
      return new RegExp(source);
    } catch (e) {
      throw new Error(`"${source}" is not a valid regular expression`);
    }
  } else {
    return source;
  }
}
