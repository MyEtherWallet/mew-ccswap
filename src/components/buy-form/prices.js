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

async function getSimplexQuote(
  fiatCurrency,
  cryptoCurrency,
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
        cryptoCurrency: cryptoCurrency,
        requestedCurrency: requestedCurrency,
        requestedAmount: requestedAmount,
      },
    })
    .then(
      (response) => {
        return response.data;
      },
      (error) => {
        throw error;
      }
    );
}

export { supportedCrypto, supportedFiat, currencySymbols, getSimplexQuote };
