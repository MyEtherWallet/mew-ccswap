import axios from 'axios';

const supportedCrypto = ['ETH', 'BTC', 'BNB', 'MATIC'];
const supportedFiat = ['USD', 'RUB', 'EUR', 'JPY', 'AUD', 'CAD', 'GBP'];

async function getPrices(crypto) {
  const api =
    'https://mainnet.mewwallet.dev/v3/purchase/providers/web?iso=us&cryptoCurrency=' +
    crypto.toUpperCase();

  return await axios.get(api).then(
    (response) => {
      return response.data;
    },
    (error) => {
      console.log(error);
    }
  );
}

async function getSimplexPrices(crypto) {
  console.log('getSimplexPrices =================================');

  const prices = await getPrices(crypto);

  const simplexPrices = prices.filter(
    (provider) => provider.name.toLowerCase() === 'simplex'
  )[0];
  return simplexPrices;
}

export { supportedCrypto, supportedFiat, getSimplexPrices };
