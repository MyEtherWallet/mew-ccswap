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
        return response.data;
      },
      (error) => {
        console.log(error);
      }
    );
}

async function getSimplexOrder(paymentId, address) {
  return await axios
    .get(orderApiUrl, {
      params: {
        paymentId: paymentId,
        address: address,
      },
    })
    .then(
      (response) => {
        return response.data;
      },
      (error) => {
        console.log(error);
      }
    );
}

async function executeOrder(
  address,
  fiatCurrency,
  requestedCurrency,
  requestedAmount,
  cryptoCurrency
) {
  const quote = await getSimplexQuote(
    address,
    fiatCurrency,
    requestedCurrency,
    requestedAmount,
    cryptoCurrency
  );

  const order = await getSimplexOrder(quote.payment_id, address);

  console.log(order);
}

export { executeOrder };
