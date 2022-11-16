import { isNull } from 'lodash';
import { isBN, toBN } from 'web3-utils';
import { fromBase, toBase } from './units';

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
      : isBN(number)
      ? currencyToNumber(number.toString())
      : number;
  if (isNaN(number)) {
    return convertNumber({ currency, options: {}, convertedPrice: 0.0 });
  }
  const decimals = number.toString().split('.')[1]?.length || 0;
  const convertedPrice = small
    ? priceConversion(number, decimals, rate).toFixed(6)
    : verySmall
    ? priceConversion(number, decimals, rate).toFixed(7)
    : priceConversion(number, decimals, rate);
  return convertNumber({ currency, options, convertedPrice: Number.parseFloat(convertedPrice.toString()) });
};

const priceConversion = (num: number, decimals: number, rate: number): number => {
  return parseFloat(fromBase(toBN(toBase(num, decimals)).muln(rate).toString(), decimals))
}

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
}

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