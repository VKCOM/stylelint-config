export function isRegExp(object: unknown): object is RegExp {
  return Object.prototype.toString.call(object) === '[object RegExp]';
}

export function isObject(object: unknown): object is {} {
  return Object.prototype.toString.call(object) === '[object Object]';
}