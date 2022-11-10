import BigNumber from 'bignumber.js';
import { isNull } from 'lodash';
import { isBigNumber } from 'web3-utils';

/**
 * Localizes numbers to its specified currency
 * @returns {string} converted number
 */
export const localizeCurrency = ({
  currency = 'USD',
  number = '0.00' as any,
  rate = 1,
  small = false,
  verySmall = false
}) => {
  if (isNull(number)) {
    return convertNumber({ currency, options: {}, convertedPrice: 0.0 });
  }
  const options = number.tooltipText
    ? {
        notation: 'compact',
        minimumFractionDigits: 3,
        maximumFractionDigits: 4
      }
    : small
    ? {
        notation: 'compact',
        minimumFractionDigits: 5,
        maximumFractionDigits: 6
      }
    : {};

  rate = typeof rate === 'string' ? currencyToNumber(rate) : rate;
  number =
    typeof number === 'string'
      ? currencyToNumber(number)
      : number.tooltipText
      ? currencyToNumber(number.tooltipText)
      : isBigNumber(number)
      ? currencyToNumber(number.toString())
      : number;
  //const locale = locales[currency] ? locales[currency] : 'en-US';
  if (isNaN(number)) {
    return convertNumber({ currency, options: {}, convertedPrice: 0.0 });
  }
  const convertedPrice = small
    ? new BigNumber(number).times(rate).toFixed(6)
    : verySmall
    ? new BigNumber(number).times(rate).toFixed(7)
    : new BigNumber(number).times(rate);
  return convertNumber({ currency, options, convertedPrice: Number.parseFloat(convertedPrice.toString()) });
};

/**
 * Converts string representing fiat to a float
 * @param {string} currency
 * @returns {Number}
 */
export const currencyToNumber = (currency: string) =>
  typeof currency === 'string'
    ? parseFloat(currency.replace(/[,$₽<\s]/g, ''))
    : currency;

interface NumberObj {
    currency: string,
    options: any,
    convertedPrice: number,
};

/**
 * Converts number to a local currency
 * @returns {string} Converted Number
 */
const convertNumber = (numberObj: NumberObj) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: numberObj.currency,
      currencyDisplay: 'narrowSymbol',
      ...numberObj.options
    }).format(numberObj.convertedPrice);
  } catch (e) {
    if (e instanceof Error)
        throw new Error(e.message);
  }
};