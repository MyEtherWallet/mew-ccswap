import axios from 'axios';

const quoteApiUrl =
  'https://mainnet.mewwallet.dev/purchase/simplex/quote?fiatCurrency=USD&requestedCurrency=ETH&requestedAmount=2&cryptoCurrency=ETH';
const orderApiUrl = 'https://mainnet.mewwallet.dev/purchase/simplex/order';

async function getSimplexQuote(
  address,
  fiatCurrency,
  requestedCurrency,
  requestedAmount,
  cryptoCurrency
) {
  return await axios
    .get(quoteApiUrl, {
      params: {
        id: `WEB|${address}`,
        fiatCurrency: fiatCurrency,
        requestedCurrency: requestedCurrency,
        requestedAmount: requestedAmount,
        cryptoCurrency: cryptoCurrency,
      },
    })
    .then(
      (response) => {
        //console.log(response);
        return response.data;
      },
      (error) => {
        console.log(error);
      }
    );
}

async function getSimplexOrder(
  address,
  fiatCurrency,
  requestedCurrency,
  requestedAmount,
  cryptoCurrency
) {
  return await axios
    .get(quoteApiUrl, {
      params: {
        id: `WEB|${address}`,
        fiatCurrency: fiatCurrency,
        requestedCurrency: requestedCurrency,
        requestedAmount: requestedAmount,
        cryptoCurrency: cryptoCurrency,
      },
    })
    .then(
      (response) => {
        //console.log(response);
        return response.data;
      },
      (error) => {
        console.log(error);
      }
    );
}

export { getSimplexQuote, getSimplexOrder };
