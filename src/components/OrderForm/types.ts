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
    fiatAmount: string,
    min: string
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

interface Assets {
    chain: string;
    name: string;
    assets: Array<NewToken>;
}

interface NewToken {
    chain: string;
    contract_address: string;
    providers: Array<string>;
    symbol: string;
}

interface NewLimits {
    min: number;
    max: number;
}

interface NewFiat {
    fiat_currency: string;
    is_sell_supported: boolean;
    limits: NewLimits;
    payment_methods: Array<string>;
    img?: string;
}

interface Providers {
    fiats: Array<NewFiat>
    fiats_list: Array<string>
    isos_list: Array<string>
    provider: string
}

interface LeftBtn {
    method: () => void;
}


interface NameResolver {
    resolveAddress(name: string, type: string): Promise<string>;
}

interface resolvedName {
    name: string;
}

export {
    Crypto, Fiat, QuoteData, SubmitData, Data, PriceItem, NameResolver,
    resolvedName, Assets, NewToken, Providers, NewFiat, LeftBtn
}