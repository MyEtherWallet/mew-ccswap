class Crypto {
    decimals: number;
    img: string;
    name: string;
    subtext: string;
    value: string;
    symbol: string;
    network: string;

    constructor(name: string, subtext: string, network: string, decimals: number, img: string) {
        this.decimals = decimals;
        this.img = img;
        this.name = name;
        this.subtext = subtext;
        this.value = name;
        this.symbol = name;
        this.network = network;
    }
}
interface Fiat {
    name: string
    value: string,
    img: string
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
    moonpay_quote: QuoteData, // Rename when done
    open_providers: number,
    selected_currency: Crypto,
    selected_fiat: Fiat,
    disable_moonpay: boolean
}
interface Network {
    name: string,
    name_long: string,
    chainID: number,
    tokens: Array<Crypto>,
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
interface Data {
    conversion_rates: { [currency: string]: number };
    limits: { [currency: string]: { min: number; max: number } };
    prices: { [currency: string]: string };
}

interface ConversionRates {
    exchange_rate: string;
    fiat_currency: string;
}

interface limits_limit {
    max: string;
    min: string;
}
interface Limits {
    crypto_currency: string;
    type: string;
    limit: limits_limit;
}

interface prices {
    crypto_currency: string;
    fiat_currency: string;
    price: string;
}

interface PriceItem {
    ach: boolean;
    conversion_rates: Array<ConversionRates>;
    crypto_currencies: Array<string>;
    fiat_currencies: Array<string>;
    prices: Array<prices>;
    limits: Array<Limits>;
    name: string;
}
export { Crypto, Fiat, QuoteData, SubmitData, Network, Data, PriceItem }