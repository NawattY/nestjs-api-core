import { isEmpty } from 'lodash';

export function isAppendOrInclude(text?: string, value?: string): boolean {
  if (isEmpty(text) || isEmpty(value)) {
    return false;
  }

  const textSplit = text.split(',');

  if (textSplit.includes(value)) {
    return true;
  }

  return false;
}
