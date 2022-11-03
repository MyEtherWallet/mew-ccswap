interface Crypto {
    decimals: number,
    img: string,
    name: string,
    subtext: string,
    value: string,
    symbol: string,
    network: string,
    contract: string
}
interface Fiat {
    name: string
    value: string,
    img: any
}
// Moonpay Buy Object
interface BuyObj {
    cryptoToFiat: string,
    selectedCryptoName: string,
    plusFeeF: string,
    includesFeeText: string,
    networkFeeText: string,
    dailyLimit: string,
    monthlyLimit: string,
    fiatAmount: string
}
interface SubmitData {
  simplex_quote: any,
  address: string,
  buyObj: BuyObj,
  openProviders: number,
  selected_currency: Crypto,
  selected_fiat: Fiat
}

export {Crypto, Fiat, BuyObj, SubmitData}