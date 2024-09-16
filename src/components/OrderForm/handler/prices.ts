import axios from "axios";
import { toNumber } from "lodash";
import { sha3 } from "web3-utils";
import api from './api';

const supportedCrypto = ["ETH", "BTC", "BCH", "POL", "USDT", "USDC", "DAI", "DOT", "KSM", "KDA", "PYUSD", "BSC", "OP", "ARB", 'TUSD',
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
  USD: "$", // US Dollar
  RUB: "₽", // Russian Ruble
  EUR: "€", // Euro
  JPY: "¥", // Japanese Yen
  AUD: "AU$", // Australian dollar
  CAD: "CA$", // Canadian dollar
  GBP: "£", // British Pound Sterling
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
  cryptoCurrency?: "ETH" | "BTC" | "BCH" | "LTC" | "DOGE" | "POL" | "USDT" | "USDC" | "DAI" | "DOT" | "KSM" | "KDA" | "PYUSD" | "OP" | "ARB" | "BSC" | "TUSD" | "FUDSD-SC" | "USDC-SC" | "USDT-SC" | "USDC-MATIC" | "USDT-MATIC" | "USDT-ARBITRUM" | "USDT-OPTIMISM" | "SOL"
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
  cryptoCurrency?: "ETH" | "POL" | "BNB" | "USDT" | "USDC"
) {
  if (cryptoCurrency)
    return await getSupportedFiatToSell(cryptoCurrency)
      .then((response) => filterData(response))
      .catch((e) => {
        throw e;
      });
  const cryptos = ["ETH", "BNB", "POL", "USDT", "USDC", "DAI"];
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
