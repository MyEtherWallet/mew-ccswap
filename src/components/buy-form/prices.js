import axios from 'axios';

const supportedCrypto = ['ETH', 'BNB', 'MATIC'];
//const supportedFiat = ['USD', 'RUB', 'EUR', 'JPY', 'AUD', 'CAD', 'GBP'];
const supportedFiat = ['USD', 'EUR', 'JPY', 'AUD', 'CAD', 'GBP'];
const currencySymbols = {
  USD: '$', // US Dollar
  RUB: '₽', // Russian Ruble
  EUR: '€', // Euro
  JPY: '¥', // Japanese Yen
  AUD: 'AU$', // Australian dollar
  CAD: 'CA$', // Canadian dollar
  GBP: '£', // British Pound Sterling
};

const defaultApiUrl =
  'https://mainnet.mewwallet.dev/v3/purchase/providers/web?iso=us&cryptoCurrency=';

async function getCryptoData(crypto) {
  const fullApiUrl = defaultApiUrl + crypto.toUpperCase();

  return await axios.get(fullApiUrl).then(
    (response) => {
      //console.log('Loading API data...');

      return response.data;
    },
    (error) => {
      console.log(error);
    }
  );
}

async function getFiatPrice(provider, crypto, fiat) {
  const allProviders = await getCryptoData(crypto);

  const theProvider = allProviders.filter(
    (p) => p.name.toLowerCase() === provider.toLowerCase()
  )[0];

  const fiatPriceForCrypto = theProvider.prices.filter((p) => {
    return p.fiat_currency === fiat;
  })[0];

  //console.log(fiatPriceForCrypto.price);

  return fiatPriceForCrypto.price;
}

async function getSimplexFiatPrice(
  fiatCurrency,
  requestedCurrency,
  requestedAmount = 1,
  address = '0x2d27851680eB0A41d6F77CB7b38F64752bC1DEFD'
) {
  const quoteApiUrl = 'https://mainnet.mewwallet.dev/purchase/simplex/quote';

  return await axios
    .get(quoteApiUrl, {
      params: {
        id: `WEB|${address}`,
        fiatCurrency: fiatCurrency,
        requestedCurrency: requestedCurrency,
        requestedAmount: requestedAmount,
      },
    })
    .then(
      (response) => {
        console.log(response.data.fiat_amount);
        return response.data.fiat_amount;
      },
      (error) => {
        console.log(error);
      }
    );
}

export {
  supportedCrypto,
  supportedFiat,
  currencySymbols,
  getFiatPrice,
  getSimplexFiatPrice,
};
