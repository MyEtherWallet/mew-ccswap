export interface FiatCurrencyConversionRate {
  rate: number;
  baseRate: number;
  fiatCurrency: {
    decimals: number;
  };
}

export class PurchaseComponentsFeeDescription {
  percentFee = 0;
  minimumFee = 0;
  networkFee = 0;

  constructor(percentFee: number, minimumFee: number, networkFee: number) {
    this.percentFee = percentFee;
    this.minimumFee = minimumFee;
    this.networkFee = networkFee;
  }
}

export interface PurchaseCryptoCurrency {
  decimals: number;
}

export interface PurchasePrice {
  price: number;
  fiatCurrency: {
    decimals: number;
  };
}

export interface PurchaseCryptoCurrency {
  decimals: number;
}

export interface PurchasePrice {
  price: number;
  fiatCurrency: {
    decimals: number;
  };
}