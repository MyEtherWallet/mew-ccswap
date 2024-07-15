import axios from "axios";
import { getSimplexQuote, getTopperUrl } from "./prices";
import { sha3 } from "web3-utils";
const API = "https://development.mewwallet.dev";
const apiOrder = "https://development.mewwallet.dev/purchase/simplex/order";

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
  const id = `WEB|${sha3(form["destination_wallet[address]"])?.substring(
    0,
    42
  )}`;
  const url = `${API}/v2/purchase/simplex/order?id=${id}&fiatCurrency=${form["fiat_total_amount[currency]"]}&requestedCurrency=${form["fiat_total_amount[currency]"]}&requestedAmount=${form["fiat_total_amount[amount]"]}&address=${form["destination_wallet[address]"]}&cryptoCurrency=${form["destination_wallet[currency]"]}`;
  window.location.href = encodeURI(url);
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

/**
 * Execute Topper payment
 */

async function executeTopperPayment(
  fiatCurrency: string,
  cryptoCurrency: string,
  requestedCurrency: string,
  requestedAmount: string,
  address: string) {
  let response = null;
  try {
    response = await getTopperUrl(fiatCurrency, cryptoCurrency, requestedAmount, address);
  } catch (e: any) {
    throw new Error(e);
  }
  return response;
}

/*
  ** MoonPay
  */
async function executeMoonpayBuy(tokenSymbol: string, fiatCurrency: string, amount: string, address: string) {
  const hash = sha3(address);
  const id = `WEB|${hash?.substring(0, 42)}`;
  const q = window.location.search;
  const platform = q.includes('platform=enkrypt') ? 'enkrypt' : 'web';
  return new Promise<void>(resolve => {
    let link = `${API}/v3/purchase/moonpay/order?address=${address}&id=${id}&cryptoCurrency=${tokenSymbol}&fiatCurrency=${fiatCurrency}&platform=${platform}`;
    if (amount) {
      link += `&requestedAmount=${amount}`;
    }
    const parsedUrl = encodeURI(link);
    // eslint-disable-next-line
    window.location.href = parsedUrl;
    resolve();
  });
}

async function executeMoonpaySell(tokenSymbol: string, amount: string, address: string) {
  const hash = sha3(address);
  const id = `WEB|${hash?.substring(0, 42)}`;

  const q = window.location.search;
  const platform = q.includes('platform=enkrypt') ? 'enkrypt' : 'web';
  return new Promise<void>(resolve => {
    const parsedUrl = encodeURI(
      `${API}/v3/sell/moonpay/order?address=${address}&id=${id}&cryptoCurrency=${tokenSymbol}&requestedAmount=${amount}&platform=${platform}`
    );
    // eslint-disable-next-line
    window.location.href = parsedUrl;
    resolve();
  });
}

export { executeSimplexPayment, executeMoonpaySell, executeMoonpayBuy, executeTopperPayment };
