import axios from 'axios';

const supportedCrypto = ['ETH', 'BTC', 'BNB', 'MATIC'];
const supportedFiat = ['USD', 'RUB', 'EUR', 'JPY', 'AUD', 'CAD', 'GBP'];
const defaultApiUrl =
  'https://mainnet.mewwallet.dev/v3/purchase/providers/web?iso=us&cryptoCurrency=';

async function getCryptoData(crypto) {
  const fullApiUrl = defaultApiUrl + crypto.toUpperCase();

  return await axios.get(fullApiUrl).then(
    (response) => {
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

  return fiatPriceForCrypto.price;
}

export { supportedCrypto, supportedFiat, getFiatPrice };
