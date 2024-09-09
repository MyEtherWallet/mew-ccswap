class Crypto {
  decimals: number;
  img: string;
  name: string;
  subtext: string;
  value: string;
  symbol: string;
  network: string;
  name_long?: string;

  constructor(
    name: string,
    subtext: string,
    network: string,
    decimals: number,
    img: string,
    name_long?: string
  ) {
    this.decimals = decimals;
    this.img = img;
    this.name = name;
    this.subtext = subtext;
    this.value = name;
    this.symbol = name;
    this.network = network;
    this.name_long = name_long;
  }
}
interface Fiat {
  name: string;
  value: string;
  img: string;
}
// Provider Quote Object
interface QuoteData {
  cryptoToFiat: string;
  selectedCryptoName: string;
  plusFeeF: string;
  includesFeeText: string;
  networkFeeText: string;
  dailyLimit: string;
  monthlyLimit: string;
  fiatAmount: string;
  fiatAmountF: string;
}
interface SubmitData {
  simplex_quote: QuoteData;
  topper_quote: QuoteData;
  address: string;
  moonpay_quote: QuoteData; // Rename when done
  open_providers: number;
  selected_currency: Crypto;
  selected_fiat: Fiat;
  fiat_amount: string;
  disable_moonpay: boolean;
}

interface SubmitSellData {
  address: string;
  selected_currency: Crypto;
  selected_fiat: Fiat;
  fiat_amount: string;
}
interface Network {
  name: string;
  name_long: string;
  chainID: number;
  tokens: Array<Crypto>;
  icon: any;
  currencyName: string;
  url: string;
  port: number;
}
interface Data {
  conversion_rates: { [currency: string]: number };
  limits: { [currency: string]: { min: number; max: number } };
  prices: { [currency: string]: string };
}
export { Crypto, Fiat, QuoteData, SubmitData, SubmitSellData, Network, Data };
