//
//  PuchaseSimplexFeeModel
//  MEWmodels
//
//  Created by Mikhail Nikanorov on 3/24/21.
//  Copyright © 2021 MyEtherWallet Inc. All rights reserved.
//

import {FiatCurrencyConversionRate, PurchaseComponentsFeeDescription, PurchaseCryptoCurrency, PurchasePrice} from './types';

let _providerMinFee           = 10.0
let _providerPlainFee         = 0.0
let providerReducedPercentFee = 0.0175
let providerPercentFee        = 0.0525
let mewPercentFee             = 0
let networkFee                : number

function providerMinFee(fiatConversionRate: FiatCurrencyConversionRate): number {
  return _providerMinFee * fiatConversionRate.rate / fiatConversionRate.baseRate
}

function providerPlainFee(fiatConversionRate: FiatCurrencyConversionRate): number {
  return _providerPlainFee * fiatConversionRate.rate / fiatConversionRate.baseRate
}

// MARK: - LifeCycle

function init(NetworkFee: number | null) {
  networkFee = NetworkFee ?? 2.65
}

// MARK: - PurchaseProviderFee

function feeDescription(fiatConversionRate: FiatCurrencyConversionRate): PurchaseComponentsFeeDescription {
  const decimals = Math.pow(10,fiatConversionRate.fiatCurrency.decimals);
  const minFee = Math.round(providerMinFee(fiatConversionRate) * decimals) / decimals;
  const networkFeeRounded = Math.round(networkFee * fiatConversionRate.rate * decimals) / decimals;
  return new PurchaseComponentsFeeDescription(providerPercentFee, minFee, networkFeeRounded);
}

// function calculateCrypto(amount: number, cryptoCurrency: PurchaseCryptoCurrency, price: PurchasePrice, fiatConversionRate: FiatCurrencyConversionRate) {
//   if (price.price <= 0) {
//     return 0;
//   }
//   let amount = amount.rounded(price.fiatCurrency.decimals, .down);
//   let fee = fiatFee(amount, fiatConversionRate).rounded(price.fiatCurrency.decimals, .bankers);
//   let base = fiatBase(amount, fee).rounded(price.fiatCurrency.decimals, .down);

//   if (base <= 0) {
//     return 0;
//   }

//   let crypto = max(base / price.price, .zero);
//   return crypto.rounded(cryptoCurrency.decimals, .down);
// }

// function calculateFiat(amount: number, cryptoCurrency: PurchaseCryptoCurrency, price: PurchasePrice, fiatConversionRate: FiatCurrencyConversionRate) {
//   let amount = amount.rounded(cryptoCurrency.decimals, .down);
//   let base = cryptoBase(amount, price.price).rounded(price.fiatCurrency.decimals, .down);
  
//   let totalMin = cryptoTotal(true, base, fiatConversionRate);
//   let totalMax = cryptoTotal(false, base, fiatConversionRate);
  
//   return max(totalMin, totalMax).rounded(price.fiatCurrency.decimals, .up);
// }

// function calculateFiatFee(amount: number, price: PurchasePrice, fiatConversionRate: FiatCurrencyConversionRate) {
//   if (price.price <= 0) {
//     return 0;
//   }

//   let amount = amount.rounded(price.fiatCurrency.decimals, .down);
//   let fee = fiatFee(amount, fiatConversionRate).rounded(price.fiatCurrency.decimals, .bankers);
//   let base = fiatBase(amount, fee).rounded(price.fiatCurrency.decimals, .down);
//   if (base <= 0) {
//     return 0;
//   }

//   return amount - base;
// }

// MARK: - Calculation

// MARK: Fiat -> Crypto

function fiatFee(amount: number, fiatConversionRate: FiatCurrencyConversionRate) {
  let convertedMinFee = providerMinFee(fiatConversionRate);
  let minFee = (amount - convertedMinFee) * providerReducedPercentFee + convertedMinFee;
  let calculatedFee = amount * providerPercentFee;
  return Math.max(minFee, calculatedFee);
}

function fiatBase(amount: number, fee: number) {
  return Math.max(amount - fee, 0);
}

// MARK: Crypto -> Fiat

function cryptoTotal(min: boolean, amount: number, fiatConversionRate: FiatCurrencyConversionRate) {
  let total: number;
  if (min) {
    let convertedMinFee = providerMinFee(fiatConversionRate);
    total = (amount + (Number(1) - providerReducedPercentFee) * convertedMinFee) / (Number(1) - providerReducedPercentFee);
  } else {
    total = amount / (Number(1) - providerPercentFee);
  }
  return total;
}

function cryptoBase(amount: number, price: number): number {
  return amount * price;
}