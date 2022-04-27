import axios from 'axios';
import { getSimplexQuote } from './prices.js';

const orderApiUrl = 'https://mainnet.mewwallet.dev/purchase/simplex/order';

async function getSimplexOrder(paymentId, address) {
  return await axios
    .get(orderApiUrl, {
      params: {
        paymentId: paymentId,
        address: address,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {});
}

async function executeOrder(
  fiatCurrency,
  cryptoCurrency,
  requestedCurrency,
  requestedAmount,
  address
) {
  let responseQuote = null;

  try {
    responseQuote = await getSimplexQuote(
      fiatCurrency,
      cryptoCurrency,
      requestedCurrency,
      requestedAmount,
      address
    );
  } catch (e) {}

  const responseOrder = await getSimplexOrder(
    responseQuote.payment_id,
    address
  );

  console.log(responseOrder);
}

export { executeOrder };
