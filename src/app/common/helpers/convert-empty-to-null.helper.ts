export function convertEmptyToNull(value: string) {
  if (
    value === null ||
    value === '' ||
    (typeof value === 'string' && value === '')
  ) {
    return undefined;
  }

  return value;
}
