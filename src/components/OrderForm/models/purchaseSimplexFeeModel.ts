//
//  PuchaseSimplexFeeModel
//  MEWmodels
//
//  Created by Mikhail Nikanorov on 3/24/21.
//  Copyright © 2021 MyEtherWallet Inc. All rights reserved.
//

import {FiatCurrencyConversionRate, PurchaseComponentsFeeDescription} from './types';

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

function init(networkFee: number?) {
  networkFee = networkFee ?? 2.65
}

// MARK: - PurchaseProviderFee

function feeDescription(fiatConversionRate: FiatCurrencyConversionRate): PurchaseComponentsFeeDescription {
  const decimals = Math.pow(10,fiatConversionRate.fiatCurrency.decimals);
  let minFee = Math.round(providerMinFee(fiatConversionRate) * decimals) / decimals;
  let networkFeeRounded = Math.round(networkFee * fiatConversionRate.rate * decimals) / decimals;
  return new PurchaseComponentsFeeDescription(providerPercentFee, minFee, networkFeeRounded)
}

func calculateCrypto(_ amount: Decimal, cryptoCurrency: PurchaseCryptoCurrency, price: PurchasePrice, fiatConversionRate: FiatCurrencyConversionRate) -> Decimal {
  guard price.price > Decimal.zero else {
    return .zero
  }
  let amount = amount.rounded(price.fiatCurrency.decimals, .down)
  let fee = self.fiatFee(amount, fiatConversionRate: fiatConversionRate).rounded(price.fiatCurrency.decimals, .bankers)
  let base = self.fiatBase(amount, fee: fee).rounded(price.fiatCurrency.decimals, .down)
  guard base > .zero else {
    return .zero
  }
  let crypto = max(base / price.price, .zero)
  return crypto.rounded(cryptoCurrency.decimals, .down)
}

func calculateFiat(_ amount: Decimal, cryptoCurrency: PurchaseCryptoCurrency, price: PurchasePrice, fiatConversionRate: FiatCurrencyConversionRate) -> Decimal {
  let amount = amount.rounded(cryptoCurrency.decimals, .down)
  let base = self.cryptoBase(amount, price: price.price).rounded(price.fiatCurrency.decimals, .down)
  
  let totalMin = self.cryptoTotal(min: true, amount: base, fiatConversionRate: fiatConversionRate)
  let totalMax = self.cryptoTotal(min: false, amount: base, fiatConversionRate: fiatConversionRate)
  
  return max(totalMin, totalMax).rounded(price.fiatCurrency.decimals, .up)
}

func calculateFiatFee(_ amount: Decimal, price: PurchasePrice, fiatConversionRate: FiatCurrencyConversionRate) -> Decimal {
  guard price.price > Decimal.zero else {
    return .zero
  }
  let amount = amount.rounded(price.fiatCurrency.decimals, .down)
  let fee = self.fiatFee(amount, fiatConversionRate: fiatConversionRate).rounded(price.fiatCurrency.decimals, .bankers)
  let base = self.fiatBase(amount, fee: fee).rounded(price.fiatCurrency.decimals, .down)
  guard base > .zero else {
    return .zero
  }
  return amount - base
}

// MARK: - Calculation

// MARK: Fiat -> Crypto

private func fiatFee(_ amount: Decimal, fiatConversionRate: FiatCurrencyConversionRate) -> Decimal {
  let convertedMinFee = self.providerMinFee(fiatConversionRate: fiatConversionRate)
  let minFee = (amount - convertedMinFee) * self.providerReducedPercentFee + convertedMinFee
  let calculatedFee = amount * self.providerPercentFee
  return max(minFee, calculatedFee)
}

private func fiatBase(_ amount: Decimal, fee: Decimal) -> Decimal {
  return max(amount - fee, .zero)
}

// MARK: Crypto -> Fiat

private func cryptoTotal(min: Bool, amount: Decimal, fiatConversionRate: FiatCurrencyConversionRate) -> Decimal {
  let total: Decimal
  if min {
    let convertedMinFee = self.providerMinFee(fiatConversionRate: fiatConversionRate)
    total = (amount + (Decimal(1) - self.providerReducedPercentFee) * convertedMinFee) / (Decimal(1) - self.providerReducedPercentFee)
  } else {
    total = amount / (Decimal(1) - self.providerPercentFee)
  }
  return total
}

function cryptoBase(amount: number, price: number): number {
  return amount * price
}