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
// Provider Quote Object
interface QuoteData {
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
  simplex_quote: QuoteData,
  address: string,
  buy_obj: QuoteData, // Rename when done
  open_providers: number,
  selected_currency: Crypto,
  selected_fiat: Fiat,
  disable_moonpay: boolean
}
interface Network {
    name: string,
    name_long: string,
    chainID: number,
    tokens: any,
    icon: any,
    currencyName: string,
    gasPriceMultiplier: number,
    coingeckoID: string,
    service: string,
    url: string,
    port: number,
    auth: boolean,
    username: string,
    password: string
}
export {Crypto, Fiat, QuoteData, SubmitData, Network}