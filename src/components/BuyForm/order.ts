import axios from "axios";
import { getSimplexQuote } from "./prices";

const apiOrder = "https://mainnet.mewwallet.dev/purchase/simplex/order";

// ===================================================================================================
// Get the quote confirmed by Simplex
// ===================================================================================================
async function confirmSimplexOrder(paymentId: string, address: string) {
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
    .catch((e) => {
      return e;
    });
}

async function submitForm(form: any) {
  const url = `https://mainnet.mewwallet.dev/v2/purchase/simplex/order?id=web%7C0xB17b4bF46d6BF4d57434d3Dd199a9964b67b7e1C&fiatCurrency=${form["fiat_total_amount[currency]"]}&requestedCurrency=${form["fiat_total_amount[currency]"]}&requestedAmount=${form["fiat_total_amount[amount]"]}&address=${form["destination_wallet[address]"]}`;
  window.location.href = url;
}

// ===================================================================================================
// Execute Simplex payment
// ===================================================================================================
async function executeSimplexPayment(
  fiatCurrency: string,
  cryptoCurrency: string,
  requestedCurrency: string,
  requestedAmount: string,
  address: string
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
  } catch (e: any) {
    throw new Error(e);
  }

  // =====================================================
  // (2) Get the quote confirmed by Simplex
  // =====================================================
  const responseOrder = await confirmSimplexOrder(
    responseQuote.payment_id,
    address
  );

  // Submit payment form data and goto Simplex payment page.
  await submitForm(responseOrder.form);

  // Manual form submission for development only
  return responseOrder.form;
}

export { executeSimplexPayment };
