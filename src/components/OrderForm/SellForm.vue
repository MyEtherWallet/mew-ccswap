<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <div class="pa-3 pa-sm-2 pa-md-2" ref="formDiv">
    <!-- ============================================================================= -->
    <!-- Crypto amount -->
    <!-- ============================================================================= -->
    <div class="mb-6 mt-6">
      <div class="d-flex justify-space-between mb-3">
        <div class="mew-heading-4 textDark--text">
          How much do you want to sell?
        </div>
        <div class="text-mew">Balance: {{ form.balance }}</div>
      </div>
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
          class="mr-1"
        ></v-text-field>
        <v-select
          style="max-width: 120px"
          v-model="form.cryptoSelected"
          :items="cryptoItems"
          :disabled="loading.data"
          :menu-props="{ closeOnContentClick: true }"
          :menu="dropdown.crypto"
          rounded="right"
          variant="outlined"
          return-object
          @click:control="openTokenSelect"
        >
          <template #prepend-inner>
            <img
              class="currency-icon mr-1"
              :src="cryptoIcon"
              :alt="form.cryptoSelected"
              width="25px"
              height="25px"
            />
          </template>
        </v-select>
      </div>
    </div>

    <!-- ============================================================================= -->
    <!-- Fiat amount -->
    <!-- ============================================================================= -->
    <div class="mb-6">
      <div class="mew-heading-4 textDark--text mb-3">You will get</div>
      <div class="d-flex mt-2">
        <v-text-field
          @input="fiatToCrypto"
          type="number"
          v-model.number="form.fiatAmount"
          required
          variant="outlined"
          rounded="left"
          :rules="rules"
          :error-messages="loading.alertMessage"
          :disabled="loading.data"
          class="mr-1"
        ></v-text-field>
        <v-select
          style="max-width: 120px"
          class="rounded-right"
          v-model="form.fiatSelected"
          :items="fiatItems"
          :disabled="loading.data"
          :menu-props="{ closeOnContentClick: true }"
          :menu="dropdown.fiat"
          return-object
          variant="outlined"
          @focusin="dropdown.fiat = true"
          @blur="dropdown.fiat = false"
        >
          <template #prepend-inner>
            <img
              class="currency-icon mr-1"
              :src="fiatIcon"
              :alt="form.fiatSelected"
              width="25px"
              height="25px"
            />
          </template>
          <template #item="data">
            <div
              class="d-flex align-center justify-space-between full-width cursor-pointer"
              @click="selectCurrency(data.item.value)"
            >
              <div class="d-flex align-center">
                <img
                  class="currency-icon mr-1 ml-3"
                  :src="getIcon(data.item.value)"
                  :alt="data.item.value"
                  width="25px"
                  height="25px"
                />
                <span class="text-capitalize ml-2 my-2 d-flex flex-column">{{
                  data.item.value
                }}</span>
              </div>
            </div>
          </template>
        </v-select>
      </div>
    </div>

    <!-- ============================================================================= -->
    <!-- Wallet address -->
    <!-- ============================================================================= -->
    <div>
      <div class="d-sm-flex align-center justify-space-between mb-2">
        <div class="mew-heading-4 mr-2">Where should we send your crypto?</div>
        <a
          class="text-mew small d-block mt-n1 mt-sm-0"
          href="https://www.myetherwallet.com/wallet/create"
          target="_blank"
        >
          Don't have one?
        </a>
      </div>
      <mew-address-select
        ref="addressSelect"
        :model-value="form.address"
        :error-messages="form.addressErrorMsg"
        :autofocus="false"
        label=""
        :items="addressBook"
        :is-valid-address="form.validAddress"
        placeholder="Enter Crypto Address"
        @keyup="verifyAddress"
        @changed="addressInput"
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
          width="360px"
          color="#05C0A5"
          @click="submitForm"
        >
          <div class="text-white">Continue</div>
        </v-btn>
      </div>
      <!--
      <div>
        <v-btn class="my-3" @click="resetForms" variant="text" size="small">
          Clear
        </v-btn>
      </div>
      -->
      <div class="text-gray mt-6">
        You will be redirected to the partner's site
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
import {
  computed,
  reactive,
  watch,
  onMounted,
  defineEmits,
  defineProps,
  PropType,
} from 'vue';
import BigNumber from 'bignumber.js';
import {
  supportedCrypto,
  supportedFiat,
  getCryptoPrices,
  currencySymbols,
} from './prices';
import { executeMoonpaySell } from './order';
import { isObject, isNumber, isString, isEmpty } from 'lodash';
import WAValidator from 'multicoin-address-validator';
import mewWallet from '@/assets/images/icon-mew-wallet.png';
import { isHexStrict, isAddress, fromWei } from 'web3-utils';
import { encodeAddress } from '@polkadot/keyring';
import MewAddressSelect from '../MewAddressSelect/MewAddressSelect.vue';
import { Networks } from './network/networks';
import { Crypto, Data, Network, Fiat } from './network/types';
import Web3 from 'web3';
import { utils } from 'ethers';
const polkdadot_chains = ['DOT', 'KSM'];

const mewWalletImg = mewWallet;
const defaultFiatValue = '0';
let gasPrice = '0';

const addressBook = [
  {
    address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
    currency: 'ETH',
    nickname: 'MEW Donations',
    resolvedAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
  },
];

const emit = defineEmits([
  'success',
  'selectedCurrency',
  'selectedFiat',
  'toAddress',
  'setQuotes',
]);

const props = defineProps({
  cryptoSelected: {
    type: Object,
    default: () => ({}),
  },
  networkSelected: {
    type: Object as PropType<Network>,
    default: () => ({}),
  },
  fiatSelected: {
    type: Object as PropType<Fiat>,
    default: () => ({}),
  },
  fiatAmount: {
    type: String,
    default: '0',
  },
});

onMounted(async () => {
  form.address = '';

  // Load URL parameter value and verify crypto address
  loadUrlParameters();
  verifyAddress();

  // Get crypto Data
  await getPrices();
  if (!isEmpty(props.fiatSelected)) {
    form.cryptoSelected = props.cryptoSelected.name;
    form.fiatSelected = props.fiatSelected.name;
    form.fiatAmount = props.fiatAmount;
    fiatToCrypto();
  } else cryptoToFiat();
  await fetchGasPrice();
  getBalance();
  setInterval(getPrices, 1000 * 60 * 2);
});

// non-reactive
const fiatItems: string[] = supportedFiat;
const cryptoItems: string[] = supportedCrypto;

let moonpayData: { [key: string]: Data } = {
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
  balance: '',
});
const loading = reactive({
  data: false,
  showAlert: false,
  processingBuyForm: false,
  alertMessage: '',
});
const dropdown = reactive({
  fiat: false,
  crypto: false,
});

const web3 = computed(() => {
  const supportedNodes: { [key: string]: any } = {
    ETH: 'ETH',
    BSC: 'BSC',
    MATIC: 'MATIC',
  };
  const nodeType = supportedNodes[props.cryptoSelected.network];
  const node = Networks.find((network) => {
    return network.name === nodeType;
  });
  return new Web3(node ? node.url : '');
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

watch(
  () => form.address,
  () => {
    if (!loading.data) {
      getBalance();
    }
  }
);

// Computed Icons for selected token
const fiatIcon = computed(() => {
  return require(`@/assets/images/fiat/${form.fiatSelected}.svg`);
});
const cryptoIcon = computed(() => {
  return require(`@/assets/images/crypto/${form.cryptoSelected}.svg`);
});

const networkFee = computed(() => {
  return fromWei(BigNumber(gasPrice).times(21000).toString());
});

const networkPrice = computed(() => {
  return moonpayData[props.networkSelected.currencyName].prices[
    form.fiatSelected
  ];
});

// methods
const getIcon = (currency: string, isFiat = true) => {
  return require(`@/assets/images/${
    isFiat ? 'fiat' : 'crypto'
  }/${currency}.svg`);
};

const selectCurrency = (currency: string, isFiat = true) => {
  if (isFiat) {
    form.fiatSelected = currency;
    dropdown.fiat = false;
  } else {
    form.cryptoSelected = currency;
    dropdown.crypto = false;
  }
};

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

// const isValidData = (data: { [key: string]: Data }) => {
//   const { cryptoSelected, fiatSelected } = form;
//   return !isEmpty(data[cryptoSelected]?.limits[fiatSelected]);
// };

const minMax = computed(() => {
  const { cryptoSelected, fiatAmount, fiatSelected } = form;
  if (!moonpayData[cryptoSelected].limits[fiatSelected]) return false;
  const limit = moonpayData[cryptoSelected].limits[fiatSelected];
  const amount = new BigNumber(fiatAmount || 0);
  const valid =
    amount.gte(new BigNumber(limit.min)) &&
    amount.lte(new BigNumber(limit.max));
  return valid;
});

const minMaxError = () => {
  const limit = moonpayData[form.cryptoSelected].limits[form.fiatSelected];
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
    const data: any[] = (await getCryptoPrices()) || [];
    data.forEach((arr: any) => {
      arr.forEach((d: any) => {
        const tmp: Data = { conversion_rates: {}, limits: {}, prices: {} };

        d.conversion_rates.forEach(
          (r: any) => (tmp.conversion_rates[r.fiat_currency] = r.exchange_rate)
        );
        d.limits.forEach((l: any) => {
          if (l.type === 'WEB') tmp.limits[l.fiat_currency] = l.limit;
        });
        d.prices.forEach((p: any) => (tmp.prices[p.fiat_currency] = p.price));
        const tokenName = d.crypto_currencies[0];
        const mainCoin = Networks.find(
          (item) => item.currencyName === tokenName
        );
        // Hard code names/decimals for now
        const tokensInfo: { [key: string]: any } = {
          USDT: { name: 'Tether', decimals: 6 },
          USDC: { name: 'USD Coin', decimals: 6 },
          DAI: { name: 'Dai Stablecoin', decimals: 18 },
        };
        // If token name isnt a native network coin
        // assume the token is ERC-20(ETH)
        if (!mainCoin) {
          const foundToken = Networks[0].tokens.find(
            (item) => item.name === tokenName
          );
          if (!foundToken) {
            const tokenInfo = tokensInfo[tokenName];
            Networks[0].tokens.push(
              new Crypto(
                tokenName,
                tokenInfo.name,
                'ETH',
                tokenInfo.decimals,
                getIcon(tokenName, false)
              )
            );
          }
        }
        if (d.name === 'MOONPAY') moonpayData[tokenName] = tmp;
      });
    });
    loading.data = false;
    emit('setQuotes', moonpayData);
    console.log('moonpayData', moonpayData);
  } catch (e: any) {
    errorHandler(e);
  }
};

const getBalance = async () => {
  const balance = await web3.value.eth.getBalance(
    form.address ? form.address : '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
    'latest'
  );
  form.balance = fromWei(balance).toString();
  return balance;
};

const fiatToCrypto = () => {
  const { fiatSelected, fiatAmount, cryptoSelected } = form;
  const price = new BigNumber(moonpayData[cryptoSelected].prices[fiatSelected]);
  const amount = new BigNumber(fiatAmount || '0');
  form.cryptoAmount = amount.dividedBy(price).toString();
};

const cryptoToFiat = () => {
  const price = new BigNumber(
    moonpayData[form.cryptoSelected].prices[form.fiatSelected]
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
      const hasErr = e.response.data.error.hasOwnProperty('errors');
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
  form.address = value;
  verifyAddress();
};

// const addressFocus = (event: Event): void => {
//   form.address = form.address ? form.address : '';
//   if (event.type === 'focus') {
//     setTimeout(() => {
//       event.target?.dispatchEvent(new Event('blur'));
//     }, 100);
//   }
// };

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
  executeMoonpaySell(form.cryptoSelected, form.cryptoAmount, form.address);
};

const openTokenSelect = () => {
  emit(
    'selectedCurrency',
    {
      name: form.fiatSelected,
      value: form.fiatSelected,
      // eslint-disable-next-line
      img: require(`@/assets/images/fiat/${form.fiatSelected}.svg`),
    },
    form.fiatAmount
  );
};

const fetchGasPrice = async (): Promise<void> => {
  if (polkdadot_chains.includes(form.cryptoSelected)) {
    gasPrice = '0';
    return;
  }
  gasPrice = await web3.value.eth.getGasPrice();
};
</script>
