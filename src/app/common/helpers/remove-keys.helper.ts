export function removeKeys(
  obj: Record<string, any>,
  keys: string[],
): Record<string, any> {
  if (obj !== Object(obj)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeKeys(item, keys));
  }

  return Object.keys(obj)
    .filter((k) => !keys.includes(k))
    .reduce(
      (acc, x) => Object.assign(acc, { [x]: removeKeys(obj[x], keys) }),
      {},
    );
}
