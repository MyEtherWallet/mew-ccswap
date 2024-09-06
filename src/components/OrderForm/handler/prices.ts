import axios from "axios";
import { toNumber } from "lodash";
import { sha3 } from "web3-utils";
import api from './api';

const supportedCrypto = ["ETH", "BTC", "BCH", "MATIC", "USDT", "USDC", "DAI", "DOT", "KSM", "KDA", "PYUSD", "BSC", "OP", "ARB", 'TUSD',
  'FDUSD-SC',
  'USDC-SC',
  'USDT-SC',
  'USDC-MATIC',
  'USDT-MATIC',
  'USDT-ARBITRUM',
  'USDT-OPTIMISM',
  'SOL', 'DOGE', 'LTC'
];

const supportedFiat = ["USD", "EUR", "JPY", "AUD", "CAD", "GBP"];
// const supportedFiat = [
//   "USD",
//   "EUR",
//   "JPY",
//   "AUD",
//   "CAD",
//   "GBP",
//   "KRW",
//   "CHF",
//   "CZK",
//   "DKK",
//   "NOK",
//   "NZD",
//   "PLN",
//   "SEK",
//   "TRY",
//   "ZAR",
//   "HUF",
// ];

const currencySymbols: { [key: string]: string } = {
  'ALL': 'Lek',
  'AFN': '؋',
  'ARS': '$',
  'AWG': 'ƒ',
  'AUD': '$',
  'AZN': '₼',
  'BSD': '$',
  'BBD': '$',
  'BYN': 'Br',
  'BZD': 'BZ$',
  'BMD': '$',
  'BOB': '$b',
  'BAM': 'KM',
  'WP	': 'P',
  'BGN': 'лв',
  'BRL': 'R$',
  'BND': '$',
  'KHR': '៛',
  'CAD': '$',
  'KYD': '$',
  'CLP': '$',
  'CNY': '¥',
  'COP': '$',
  'CRC': '₡',
  'CUP': '₱',
  'CZK': 'Kč',
  'DKK': 'kr',
  'DOP': 'RD$',
  'XCD': '$',
  'EGP': '£',
  'SVC': '$',
  'EUR': '€',
  'FKP': '£',
  'FJD': '$',
  'GHS': '¢',
  'GIP': '£',
  'GTQ': 'Q',
  'GGP': '£',
  'GYD': '$',
  'HNL': 'L',
  'HKD': '$',
  'HUF': 'Ft',
  'ISK': 'kr',
  'INR': '₹',
  'IDR': 'Rp',
  'IRR': '﷼',
  'IMP': '£',
  'ILS': '₪',
  'JMD': 'J$',
  'JPY': '¥',
  'JEP': '£',
  'KZT': 'лв',
  'KPW': '₩',
  'KGS': 'лв',
  'LAK': '₭',
  'LBP': '£',
  'LRD': '$',
  'MKD': 'ден',
  'MYR': 'RM',
  'MUR': '₨',
  'MXN': '$',
  'MNT': '₮',
  'MZN': 'MT',
  'NAD': '$',
  'NPR': '₨',
  'ANG': 'ƒ',
  'NZD': '$',
  'NIO': 'C$',
  'NGN': '₦',
  'NOK': 'kr',
  'OMR': '﷼',
  'PKR': '₨',
  'PAB': 'B /.',
  'PYG': 'Gs',
  'PEN': 'S /.',
  'PHP': '₱',
  'PLN': 'zł',
  'QAR': '﷼',
  'RON': 'lei',
  'RUB': '₽',
  'SHP': '£',
  'SAR': '﷼',
  'RSD': 'Дин.',
  'SCR': '₨',
  'SGD': '$',
  'SBD': '$',
  'SOS': 'S',
  'KRW': '₩',
  'ZAR': 'R',
  'LKR': '₨',
  'SEK': 'kr',
  'CHF': 'CHF',
  'SRD': '$',
  'SYP': '£',
  'TWD': 'NT$',
  'THB': '฿',
  'TTD': 'TT$',
  'TRY': '₺',
  'TVD': '$',
  'UAH': '₴',
  'AED': ' د.إ',
  'GBP': '£',
  'USD': '$',
  'UYU': '$U',
  'UZS': 'лв',
  'VEF': 'Bs',
  'VND': '₫',
  'YER': '﷼',
  'ZWD': 'Z$',
};

async function getSimplexQuote(
  fiatCurrency: string,
  cryptoCurrency: string,
  requestedCurrency: string,
  requestedAmount: string,
  address = "0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"
) {
  const apiQuote = `${api.endpoint}/purchase/simplex/quote`;

  return await axios
    .get(apiQuote, {
      params: {
        id: `WEB|${sha3(address)?.substring(0, 42)}`,
        fiatCurrency: fiatCurrency,
        cryptoCurrency: cryptoCurrency,
        requestedCurrency: requestedCurrency,
        requestedAmount: toNumber(requestedAmount),
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      throw e;
    });
}
async function getTopperUrl(
  fiatCurrency: string,
  cryptoCurrency: string,
  requestedAmount: string,
  address = "0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"
) {
  const apiQuote = `${api.endpoint}/v3/purchase/topper/order`;

  return await axios
    .get(apiQuote, {
      params: {
        id: `WEB|${sha3(address)?.substring(0, 42)}`,
        fiatCurrency: fiatCurrency,
        cryptoCurrency: cryptoCurrency,
        amount: toNumber(requestedAmount),
        address: address
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      throw e;
    });
}
const filterData = (res: any) => {
  const { data } = res;
  if (Array.isArray(data)) return data.filter((i) => (i.name === "SIMPLEX" || i.name === "MOONPAY" || i.name === "TOPPER"));
};

async function getCryptoPrices(
  cryptoCurrency?: "ETH" | "BTC" | "BCH" | "LTC" | "DOGE" | "MATIC" | "USDT" | "USDC" | "DAI" | "DOT" | "KSM" | "KDA" | "PYUSD" | "OP" | "ARB" | "BSC" | "TUSD" | "FUDSD-SC" | "USDC-SC" | "USDT-SC" | "USDC-MATIC" | "USDT-MATIC" | "USDT-ARBITRUM" | "USDT-OPTIMISM" | "SOL"
) {
  const apiQuote = `${api.endpoint}/v4/purchase/providers/web`;
  if (cryptoCurrency)
    return await axios
      .get(apiQuote, {
        params: {
          iso: "us",
          cryptoCurrency,
        },
      })
      .then((response) => filterData(response))
      .catch((e) => {
        throw e;
      });
  return Promise.all(
    supportedCrypto.map((c) =>
      axios
        .get(apiQuote, {
          params: {
            iso: "us",
            cryptoCurrency: c,
          },
        })
        .then((response) => filterData(response))
        .catch((e) => {
          throw e;
        })
    )
  ).catch((e) => {
    throw e;
  });
}

/**
 * Moonpay
 */
async function getFiatRatesForBuy() {
  return axios
    .get(`${api.endpoint}/v4/purchase/moonpay/quotes`, {
      headers: {
        'Accept-Language': 'en-US'
      }
    })
    .then(res => res.data);
}
/**
 *
 * @param {String} symbol - Crypto Symbol ex. ETH
 * @returns
 */
async function getSupportedFiatToBuy(symbol: string) {
  return axios
    .get(`${api.endpoint}/v4/purchase/providers/web?iso=us&cryptoCurrency=${symbol}`, {
      headers: {
        'Accept-Language': 'en-US'
      }
    })
    .then(res => res.data);
}
/*
 * Get supported fiat to sell from Moonpay
 */
async function getSupportedFiatToSell(symbol: string) {
  return axios
    .get(`${api.endpoint}/v3/sell/providers/web?iso=us&cryptoCurrency=${symbol}`, {
      headers: {
        'Accept-Language': 'en-US'
      }
    })
    .then(res => res.data);
}

async function getCryptoSellPrices(
  cryptoCurrency?: "ETH" | "MATIC" | "BNB" | "USDT" | "USDC"
) {
  if (cryptoCurrency)
    return await getSupportedFiatToSell(cryptoCurrency)
      .then((response) => filterData(response))
      .catch((e) => {
        throw e;
      });
  const cryptos = ["ETH", "BNB", "MATIC", "USDT", "USDC", "DAI"];
  return Promise.all(
    cryptos.map((c) =>
      getSupportedFiatToSell(c)
        .catch((e) => {
          throw e;
        }))
  ).catch((e) => {
    throw e;
  });
}

export {
  supportedCrypto,
  supportedFiat,
  currencySymbols,
  getSimplexQuote,
  getCryptoPrices,
  getFiatRatesForBuy,
  getSupportedFiatToBuy,
  getSupportedFiatToSell,
  getCryptoSellPrices,
  getTopperUrl
};
