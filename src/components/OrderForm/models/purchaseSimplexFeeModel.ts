//
//  PuchaseSimplexFeeModel
//  MEWmodels
//
//  Created by Mikhail Nikanorov on 3/24/21.
//  Copyright © 2021 MyEtherWallet Inc. All rights reserved.
//

import {
  FiatCurrencyConversionRate,
  PurchaseComponentsFeeDescription,
  PurchaseCryptoCurrency,
  PurchasePrice,
} from './types';
import { BigNumber } from 'bignumber.js';

const _providerMinFee = 10.0;
const _providerPlainFee = 0.0;
const providerReducedPercentFee = 0.0175;
const providerPercentFee = 0.0525;
let networkFee: number;

export function providerMinFee(
  fiatConversionRate: FiatCurrencyConversionRate
): number {
  return (
    (_providerMinFee * fiatConversionRate.rate) / fiatConversionRate.baseRate
  );
}

export function providerPlainFee(
  fiatConversionRate: FiatCurrencyConversionRate
): number {
  return (
    (_providerPlainFee * fiatConversionRate.rate) / fiatConversionRate.baseRate
  );
}

// MARK: - LifeCycle

export function init(NetworkFee: number | null) {
  networkFee = NetworkFee ?? 2.65;
}

// MARK: - PurchaseProviderFee

export function feeDescription(
  fiatConversionRate: FiatCurrencyConversionRate
): PurchaseComponentsFeeDescription {
  const decimals = fiatConversionRate.fiatCurrency.decimals;
  const minFee = roundAmount(
    providerMinFee(fiatConversionRate),
    decimals,
    BigNumber.ROUND_CEIL
  );
  const networkFeeRounded = roundAmount(
    networkFee * fiatConversionRate.rate,
    decimals,
    BigNumber.ROUND_CEIL
  );
  return new PurchaseComponentsFeeDescription(
    providerPercentFee,
    minFee,
    networkFeeRounded
  );
}

export function calculateCrypto(
  Amount: number,
  cryptoCurrency: PurchaseCryptoCurrency,
  price: PurchasePrice,
  fiatConversionRate: FiatCurrencyConversionRate
) {
  if (price.price <= 0) {
    return 0;
  }
  const decimals = price.fiatCurrency.decimals;
  const amount = roundAmount(Amount, decimals, BigNumber.ROUND_FLOOR);
  const fee = roundAmount(
    fiatFee(amount, fiatConversionRate),
    decimals,
    BigNumber.ROUND_HALF_EVEN
  );
  const base = roundAmount(
    fiatBase(amount, fee),
    decimals,
    BigNumber.ROUND_FLOOR
  );

  if (base <= 0) {
    return 0;
  }

  const crypto = Math.max(base / price.price, 0);
  return roundAmount(crypto, cryptoCurrency.decimals, BigNumber.ROUND_FLOOR);
}

export function calculateFiat(
  Amount: number,
  cryptoCurrency: PurchaseCryptoCurrency,
  price: PurchasePrice,
  fiatConversionRate: FiatCurrencyConversionRate
) {
  const amount = roundAmount(
    Amount,
    cryptoCurrency.decimals,
    BigNumber.ROUND_FLOOR
  );
  const base = roundAmount(
    cryptoBase(amount, price.price),
    price.fiatCurrency.decimals,
    BigNumber.ROUND_FLOOR
  );

  const totalMin = cryptoTotal(true, base, fiatConversionRate);
  const totalMax = cryptoTotal(false, base, fiatConversionRate);

  return roundAmount(
    Math.max(totalMin, totalMax),
    price.fiatCurrency.decimals,
    BigNumber.ROUND_CEIL
  );
}

export function calculateSimplexFiatFee(
  Amount: number,
  price: PurchasePrice,
  fiatConversionRate: FiatCurrencyConversionRate
) {
  if (price.price <= 0) {
    return 0;
  }
  const decimals = price.fiatCurrency.decimals;
  const amount = roundAmount(Amount, decimals, BigNumber.ROUND_FLOOR);
  const fee = roundAmount(
    fiatFee(amount, fiatConversionRate),
    decimals,
    BigNumber.ROUND_HALF_EVEN
  );
  const base = roundAmount(
    fiatBase(amount, fee),
    decimals,
    BigNumber.ROUND_FLOOR
  );
  if (base <= 0) {
    return 0;
  }

  return amount - base;
}

// MARK: - Calculation

// MARK: Fiat -> Crypto

export function fiatFee(
  amount: number,
  fiatConversionRate: FiatCurrencyConversionRate
) {
  const convertedMinFee = providerMinFee(fiatConversionRate);
  const minFee =
    (amount - convertedMinFee) * providerReducedPercentFee + convertedMinFee;
  const calculatedFee = amount * providerPercentFee;
  return Math.max(minFee, calculatedFee);
}

function fiatBase(amount: number, fee: number) {
  return Math.max(amount - fee, 0);
}

// MARK: Crypto -> Fiat

export function cryptoTotal(
  min: boolean,
  amount: number,
  fiatConversionRate: FiatCurrencyConversionRate
) {
  let total: number;
  if (min) {
    const convertedMinFee = providerMinFee(fiatConversionRate);
    total =
      (amount + (Number(1) - providerReducedPercentFee) * convertedMinFee) /
      (Number(1) - providerReducedPercentFee);
  } else {
    total = amount / (Number(1) - providerPercentFee);
  }
  return total;
}

function cryptoBase(amount: number, price: number): number {
  return amount * price;
}
/**
 *
 * @param amount Number to be formatted
 * @param decimalPlaces Decimal places to format to
 * @param roundingMode BigNumber RoundingMode to round number
 * @returns Rounded number
 */
function roundAmount(
  amount: number,
  decimalPlaces: number,
  roundingMode: BigNumber.RoundingMode
): number {
  return new BigNumber(amount)
    .decimalPlaces(decimalPlaces, roundingMode)
    .toNumber();
}
