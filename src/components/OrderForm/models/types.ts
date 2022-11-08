export interface FiatCurrencyConversionRate {
    rate: number,
    baseRate: number,
    fiatCurrency: {
        decimals: number
    }
}

export class PurchaseComponentsFeeDescription {
    public percentFee = 0;
    minimumFee = 0;
    networkFee = 0;

    constructor(percentFee: number, minimumFee: number, networkFee: number) {
        this.percentFee = percentFee;
        this.minimumFee = minimumFee;
        this.networkFee = networkFee;
    }
}