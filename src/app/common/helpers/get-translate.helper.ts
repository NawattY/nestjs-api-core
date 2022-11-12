import { get, isEmpty } from 'lodash';

export function getTranslate(text: string[]): string {
  if (isEmpty(text)) {
    return '';
  }

  let translation = get(text, process.env.LOCALE, '');

  if (isEmpty(translation)) {
    translation = get(text, process.env.MERCHANT_DEFAULT_LOCALE, '');
  }

  return translation;
}
