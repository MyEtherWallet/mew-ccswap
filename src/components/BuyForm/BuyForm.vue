<template>
  <div
    class="component--buy-form elevated-box pa-3 pa-sm-6 pa-md-8"
    ref="formDiv"
  >
    <!-- ============================================================================= -->
    <!-- Fiat amount -->
    <!-- ============================================================================= -->
    <div class="mb-10">
      <div class="d-flex align-center">
        <div class="mew-heading-3 textDark--text mb-5">
          How much do you want to spend?
        </div>
        <div v-if="loading.data" class="ml-2">
          <span class="h3 font-weight-regular mr-1 text--mew">Loading</span>
          <v-progress-circular
            :size="11"
            :width="2"
            indeterminate
          ></v-progress-circular>
        </div>
      </div>
      <div class="d-flex mt-2">
        <v-text-field
          @input="fiatToCrypto"
          type="number"
          v-model.number="form.fiatAmount"
          required
          variant="outlined"
          class="rounded-left"
          :disabled="loading.data"
          :rules="rules"
        ></v-text-field>
        <v-select
          style="max-width: 120px"
          class="rounded-right"
          v-model="form.fiatSelected"
          :items="fiatItems"
          :disabled="loading.data"
          variant="outlined"
        ></v-select>
      </div>
    </div>

    <!-- ============================================================================= -->
    <!-- Crypto amount -->
    <!-- ============================================================================= -->
    <div class="mb-10">
      <div class="mb-2">You will get</div>
      <div class="d-flex mt-2">
        <v-text-field
          @input="cryptoToFiat"
          type="number"
          v-model.number="form.cryptoAmount"
          required
          variant="outlined"
          rounded="left"
          :rules="rules"
          :error-messages="loading.alertMessage"
          :disabled="loading.data"
        ></v-text-field>
        <v-select
          style="max-width: 120px"
          v-model="form.cryptoSelected"
          :items="cryptoItems"
          :disabled="loading.data"
          rounded="right"
          variant="outlined"
        ></v-select>
      </div>
    </div>

    <!-- ============================================================================= -->
    <!-- Wallet address -->
    <!-- ============================================================================= -->
    <div>
      <div class="mew-heading-3 textDark--text mb-5">
        Where should we send your crypto?
      </div>
      <mew-address-select
        ref="addressSelect"
        :model-value="form.address"
        :error-messages="form.addressErrorMsg"
        :autofocus="true"
        label=""
        :items="addressBook"
        :is-valid-address="form.validAddress"
        placeholder="Enter Crypto Address"
        @keyup="verifyAddress"
        @input="addressInput"
        @focus.once="addressFocus"
      />
    </div>

    <!-- ============================================================================= -->
    <!-- Buy/Rest button -->
    <!-- ============================================================================= -->
    <div v-if="!loading.processingBuyForm" class="pt-2 text-center">
      <div>
        <v-btn
          rounded="pill"
          :disabled="!isValidForm"
          min-height="60px"
          min-width="360px"
          color="#05C0A5"
          @click="submitForm"
        >
          <div class="text--white">Continue</div>
        </v-btn>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <v-progress-circular
        :size="70"
        :width="7"
        indeterminate
        color="#05c0a5"
      ></v-progress-circular>
      <div
        class="text-center font-weight-bold mt-3"
        style="line-height: 1.4rem"
      >
        Processing purchase....
      </div>
    </div>
    <!-- ============================================================================= -->
    <!-- END -->
    <!-- ============================================================================= -->
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch, onMounted } from 'vue';
import BigNumber from 'bignumber.js';
import {
  supportedCrypto,
  supportedFiat,
  getSimplexPrices,
  currencySymbols,
} from './prices';
import { executeSimplexPayment } from './order';
import { isObject, isNumber, isString } from 'lodash';
import WAValidator from 'multicoin-address-validator';
import mewWallet from '@/assets/images/icon-mew-wallet.png';
import { isHexStrict, isAddress } from 'web3-utils';
import { encodeAddress } from '@polkadot/keyring';
import MewAddressSelect from '../MewAddressSelect/MewAddressSelect.vue';

const mewWalletImg = mewWallet;
const defaultFiatValue = '0';

const addressBook = [
  {
    address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
    currency: 'ETH',
    nickname: 'MEW Donations',
    resolvedAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
  },
];

onMounted(async () => {
  form.address = '';

  // Load URL parameter value and verify crypto address
  loadUrlParameters();
  verifyAddress();

  // Get crypto Data
  await getPrices();
  cryptoToFiat();
  setInterval(getPrices, 1000 * 60 * 2);
});

// data

// non-reactive
const fiatItems: string[] = supportedFiat;
const cryptoItems: string[] = supportedCrypto;
interface Data {
  conversion_rates: { [currency: string]: number };
  limits: { [currency: string]: { min: number; max: number } };
  prices: { [currency: string]: string };
}

let simplexData: { [key: string]: Data } = {
  ETH: {
    conversion_rates: {},
    limits: {},
    prices: {},
  },
  MATIC: {
    conversion_rates: {},
    limits: {},
    prices: {},
  },
  BNB: {
    conversion_rates: {},
    limits: {},
    prices: {},
  },
  DOT: {
    conversion_rates: {},
    limits: {},
    prices: {},
  },
  KSM: {
    conversion_rates: {},
    limits: {},
    prices: {},
  },
};
// reactive
const form = reactive({
  fiatAmount: defaultFiatValue,
  fiatSelected: 'USD',
  cryptoAmount: '1',
  cryptoSelected: 'ETH',
  address: '',
  validAddress: false,
  addressErrorMsg: '',
  reCaptchaToken: '',
  addressError: false,
});
const loading = reactive({
  data: false,
  showAlert: false,
  processingBuyForm: false,
  alertMessage: '',
});

// watchers
watch(
  () => form.cryptoSelected,
  () => {
    verifyAddress();
    fiatToCrypto();
  }
);

watch(
  () => form.fiatSelected,
  () => {
    verifyAddress();
    cryptoToFiat();
  }
);

watch(
  () => form.fiatAmount,
  () => {
    if (!loading.data) {
      minMaxError();
    }
  }
);
watch(
  () => form.cryptoAmount,
  () => {
    if (!loading.data) {
      minMaxError();
    }
  }
);
// methods
const isValidForm = computed(() => {
  return (
    minMax.value &&
    form.fiatSelected &&
    form.cryptoSelected &&
    form.address &&
    !form.addressError &&
    form.addressErrorMsg === '' &&
    loading.alertMessage === '' &&
    form.validAddress
  );
});

const rules = [
  (e: any) => {
    if (isString(e) && e?.length >= 1) return true;
    if (!isNumber(e)) return 'Must be a valid number';
    return true;
  },
];
const minMax = computed(() => {
  const { cryptoSelected, fiatAmount, fiatSelected } = form;
  if (!simplexData[cryptoSelected].limits[fiatSelected]) return false;
  const limit = simplexData[cryptoSelected].limits[fiatSelected];
  const amount = new BigNumber(fiatAmount || 0);
  const valid =
    amount.gte(new BigNumber(limit.min)) &&
    amount.lte(new BigNumber(limit.max));
  return valid;
});

const minMaxError = () => {
  const limit = simplexData[form.cryptoSelected].limits[form.fiatSelected];
  if (!minMax.value) {
    loading.showAlert = true;
    loading.alertMessage = `Fiat price must be between ${
      currencySymbols[form.fiatSelected]
    }${limit.min} and ${currencySymbols[form.fiatSelected]}${limit.max}`;
    return;
  }
  loading.showAlert = false;
  loading.alertMessage = '';
};
const getPrices = async () => {
  try {
    loading.data = true;
    const data: [] = await getSimplexPrices();
    data.forEach((d: any) => {
      const tmp: Data = { conversion_rates: {}, limits: {}, prices: {} };

      d.conversion_rates.forEach(
        (r: any) => (tmp.conversion_rates[r.fiat_currency] = r.exchange_rate)
      );
      d.limits.forEach((l: any) => {
        if (l.type === 'WEB') tmp.limits[l.fiat_currency] = l.limit;
      });
      d.prices.forEach((p: any) => (tmp.prices[p.fiat_currency] = p.price));
      simplexData[d.crypto_currencies[0]] = tmp;
    });
    loading.data = false;
  } catch (e: any) {
    errorHandler(e);
  }
};

const fiatToCrypto = () => {
  const { fiatSelected, fiatAmount, cryptoSelected } = form;
  const price = new BigNumber(simplexData[cryptoSelected].prices[fiatSelected]);
  const amount = new BigNumber(fiatAmount || '0');
  form.cryptoAmount = amount.dividedBy(price).toString();
};

const cryptoToFiat = () => {
  const price = new BigNumber(
    simplexData[form.cryptoSelected].prices[form.fiatSelected]
  );
  const amount = new BigNumber(form.cryptoAmount || '0');
  form.fiatAmount = amount.times(price).toFixed(2).toString();
};

const loadUrlParameters = () => {
  const queryString = window.location.search;
  if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    const queryCryptoAmount = urlParams.get('crypto_amount');
    const queryFiat = urlParams.get('fiat');
    const queryCrypto = urlParams.get('crypto');
    const queryTo = urlParams.get('to');
    form.fiatSelected = queryFiat ? queryFiat : 'USD';
    form.fiatAmount = queryCryptoAmount ? queryCryptoAmount : '100';
    form.cryptoSelected = queryCrypto ? queryCrypto : 'ETH';
    form.cryptoAmount = queryCryptoAmount ? queryCryptoAmount : '1';
    form.address = queryTo ? queryTo : '';
  }
};
// const onReCaptchaToken = (token: string): void => {
//   form.reCaptchaToken = token;
// };

const errorHandler = (e: any): void => {
  const value = new BigNumber(form.fiatAmount).gt(0);
  if (value) {
    const isErrorObj = isObject(e.response.data.error);
    if (isErrorObj) {
      // eslint-disable-next-line
      const hasErr = e.response.data.error.hasOwnProperty("errors");
      if (hasErr) {
        loading.alertMessage = e.response.data.error.errors[0].message;
      }
    } else {
      loading.alertMessage = e.response.data.error;
    }
  }
};

const validAddress = (address: string) => {
  return address && isHexStrict(address) && isAddress(address);
};

const isValidAddressPolkadotAddress = (
  address: string,
  cryptoPrefix: number
) => {
  try {
    const encodedAddress = encodeAddress(address, cryptoPrefix);
    return address === encodedAddress;
  } catch (error) {
    return false;
  }
};
// const resetForm = (): void => {
//   form.fiatAmount = defaultFiatValue;
//   form.fiatSelected = "USD";
//   form.cryptoAmount = "1";
//   form.cryptoSelected = "ETH";
//   form.address = "";
//   getPrices();
// };

const addressInput = (value: string): void => {
  console.log('addressInput', value);
  form.address = value;
};
const addressFocus = (event: Event): void => {
  form.address = form.address ? form.address : '';
  if (event.type === 'focus') {
    setTimeout(() => {
      event.target?.dispatchEvent(new Event('blur'));
    }, 100);
  }
};

const verifyAddress = (): void => {
  const polkdadot_chains = ['DOT', 'KSM'];
  const valid = !polkdadot_chains.includes(form.cryptoSelected)
    ? WAValidator.validate(form.address, form.cryptoSelected) &&
      validAddress(form.address)
    : isValidAddressPolkadotAddress(
        form.address,
        form.cryptoSelected === 'DOT' ? 0 : 2
      );
  if (valid) {
    form.addressErrorMsg = '';
    form.addressError = false;
    form.validAddress = true;
  } else {
    if (!form.address) {
      form.addressErrorMsg = '';
      form.validAddress = false;
    } else {
      form.addressErrorMsg = `Please provide a valid ${form.cryptoSelected} address`;
      form.validAddress = false;
    }
  }
};

const submitForm = (): void => {
  loading.processingBuyForm = true;
  executeSimplexPayment(
    form.fiatSelected,
    form.cryptoSelected,
    form.fiatSelected,
    form.fiatAmount,
    form.address
  );
};
</script>

<style lang="scss">
.component--buy-form {
  // Fix v-select(currency select) height issue
  .v-select .v-field .v-field__input > input {
    height: 0;
    width: 0;
  }

  .v-field--appended {
    background-color: white;
    .v-select__selection-text {
      color: black;
    }

    .v-field__append-inner {
      .v-icon {
        opacity: 1;
        &::before {
          color: white;
        }
      }
    }
  }

  .v-field__field {
    padding: 0;
  }

  .v-field__input {
    padding-top: 0;
  }

  .v-select__selection-text {
    display: flex;
    align-items: center;
  }

  // Adjust (text field) prefix font size
  .v-messages__message {
    font-weight: 300;
    font-size: 0.9rem;
  }
  .v-text-field__prefix {
    font-size: 0.8rem;
  }
}
</style>
