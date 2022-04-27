import axios from 'axios';
import { getSimplexQuote } from './prices.js';

const apiOrder = 'https://mainnet.mewwallet.dev/purchase/simplex/order';

//const apiPaymentFormSubmission = 'https://checkout.simplexcc.com/payments/new';
const apiPaymentFormSubmission =
  'https://sandbox.test-simplexcc.com/payments/new';

// ===================================================================================================
// Get the quote confirmed by Simplex
// ===================================================================================================
async function confirmSimplexOrder(paymentId, address) {
  return await axios
    .get(apiOrder, {
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

// ===================================================================================================
// Send payment form to Simplex to get the buy page link
// ===================================================================================================
/*
async function sendPaymentForm(form) {
  return await axios
    .post(apiPaymentFormSubmission, form)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((e) => {});
}
*/

// ===================================================================================================
// Execute Simplex payment
// ===================================================================================================
async function executeSimplexPayment(
  fiatCurrency,
  cryptoCurrency,
  requestedCurrency,
  requestedAmount,
  address
) {
  // =====================================================
  // (1) Get quote for crypto amount
  // =====================================================
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

  // =====================================================
  // (2) Get the quote confirmed by Simplex
  // =====================================================
  const responseOrder = await confirmSimplexOrder(
    responseQuote.payment_id,
    address
  );

  return responseOrder.form;

  // =====================================================
  // (3) Get the buy page link from Simplex
  // =====================================================
  //await sendPaymentForm(responseOrder.form);
}

export { executeSimplexPayment };
