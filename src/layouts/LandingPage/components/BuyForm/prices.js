import axios from 'axios';
import _ from 'lodash';

const supportedCrypto = ['ETH', 'BNB', 'MATIC'];
const supportedFiat = ['USD', 'EUR', 'JPY', 'AUD', 'CAD', 'GBP'];

const currencySymbols = {
  USD: '$', // US Dollar
  RUB: '₽', // Russian Ruble
  EUR: '€', // Euro
  JPY: '¥', // Japanese Yen
  AUD: 'AU$', // Australian dollar
  CAD: 'CA$', // Canadian dollar
  GBP: '£' // British Pound Sterling
};

async function getSimplexQuote(
  fiatCurrency,
  cryptoCurrency,
  requestedCurrency,
  requestedAmount,
  address = '0x2d27851680eB0A41d6F77CB7b38F64752bC1DEFD'
) {
  const apiQuote = 'https://mainnet.mewwallet.dev/purchase/simplex/quote';

  return await axios
    .get(apiQuote, {
      params: {
        id: `WEB|${address}`,
        fiatCurrency: fiatCurrency,
        cryptoCurrency: cryptoCurrency,
        requestedCurrency: requestedCurrency,
        requestedAmount: _.toNumber(requestedAmount)
      }
    })
    .then(response => {
      return response.data;
    })
    .catch(e => {
      console.log(
        `[USER INPUT ERROR] Simplex Quote API =====> ${e.response.data.error}`
      );
      throw new Error(e);
    });
}

export { supportedCrypto, supportedFiat, currencySymbols, getSimplexQuote };
