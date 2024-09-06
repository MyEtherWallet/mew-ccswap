<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <div class="pa-3 pa-sm-2 pa-md-2 components--buy-form" ref="formDiv">
    <!-- ============================================================================= -->
    <!-- Fiat amount -->
    <!-- ============================================================================= -->
    <div class="mb-6 mt-6">
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="mew-heading-4 textDark--text">I want to Buy</div>
        <div v-if="loading.data" class="ml-2 d-flex align-center">
          <span class="h3 font-weight-regular mr-1">Loading</span>
          <v-progress-circular
            :size="11"
            :width="2"
            indeterminate
          ></v-progress-circular>
        </div>
      </div>
      <div class="d-flex flex-column mt-2">
        <v-btn
          rounded="right"
          variant="outlined"
          class="no-left-border full-button"
          append-icon="mdi-menu-down"
          :disabled="loading.data"
          @click="openTokenSelect"
        >
          <template #prepend>
            <img
              class="currency-icon mr-1 padding--2"
              :src="cryptoIcon"
              :alt="form.cryptoSelected"
              width="25px"
              height="25px"
            />
          </template>
          <span>
            {{ concatenate(form.cryptoSelected) }}
          </span>
          <template v-slot:append>
            <v-icon color="grey-2" size="large"></v-icon>
          </template>
        </v-btn>
        <div>Network: {{ selectedNetwork.name_long }}</div>
      </div>
    </div>

    <!-- ============================================================================= -->
    <!-- Crypto amount -->
    <!-- ============================================================================= -->
    <div class="mb-6">
      <div class="mew-heading-4 textDark--text mb-3">I am spending</div>
      <div class="d-flex mt-2">
        <v-text-field
          :class="[
            loading.alertMessage ? '' : 'error-state',
            'no-right-border',
          ]"
          @input="fiatToCrypto"
          v-model.number="form.fiatAmount"
          required
          variant="outlined"
          :error-messages="loading.alertMessage"
          :disabled="loading.data"
          :rules="rules"
        />
        <v-select
          style="max-width: 130px; height: 56px !important"
          class="rounded-right no-left-border buy-input"
          v-model="form.fiatSelected"
          :items="filteredFiatItems"
          :disabled="loading.data"
          :menu-props="{ closeOnContentClick: true }"
          base-color="primary"
          return-object
          variant="outlined"
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
          <template #prepend-item>
            <v-text-field
              v-model="fiatFilter"
              variant="outlined"
              class="px-2"
              prepend-inner-icon="mdi-magnify"
              :autofocus="true"
              density="compact"
              placeholder="Search"
              @update:model-value="updateFiatFilter"
              @click.stop="() => {}"
            ></v-text-field>
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
      <div v-if="!loading.alertMessage" class="mt-2 mx-4">
        ~{{ form.cryptoAmount }} {{ form.cryptoSelected }}
      </div>
    </div>

    <!-- ============================================================================= -->
    <!-- Wallet address -->
    <!-- ============================================================================= -->
    <div>
      <div class="mew-heading-4 textDark--text mb-3">
        Where should we send your crypto?
      </div>
      <mew-address-select
        ref="addressSelect"
        :modelValue="form.address"
        :error-messages="form.addressErrorMsg"
        :autofocus="false"
        :is-valid-address="addressValid"
        placeholder="Enter Crypto Address"
        :network="selectedNetwork"
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
          flat
          rounded="pill"
          :disabled="!isValidForm"
          min-height="60px"
          width="360px"
          @click="submitForm"
          class="buy-button"
        >
          <div class="text-white font-weight-bold">Preview Quotes</div>
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
import {
  computed,
  reactive,
  watch,
  onMounted,
  defineEmits,
  defineProps,
  PropType,
  onUnmounted,
  ref,
  Ref,
} from "vue";
import BigNumber from "bignumber.js";
import {
  supportedCrypto,
  supportedFiat,
  getCryptoPrices,
  currencySymbols,
} from "./handler/prices";
import { isObject, isNumber, isString, isEmpty, debounce } from "lodash";
import WAValidator from "multicoin-address-validator";
import { isHexStrict, isAddress, fromWei, toBN, isHex } from "web3-utils";
import { encodeAddress } from "@polkadot/keyring";
import Web3 from "web3";

import { useGlobalStore } from "@/plugins/globalStore";

import MewAddressSelect from "../MewAddressSelect/MewAddressSelect.vue";
import {
  formatFiatValue,
  formatFloatingPointValue,
} from "@/helpers/numberFormatHelper";
import { Networks } from "./network/networks";
import { Crypto, Data, Network, Fiat } from "./network/types";
import {
  init,
  calculateSimplexFiatFee,
} from "./models/purchaseSimplexFeeModel";
import { fromBase, toBase } from "@/helpers/units";
import { storeToRefs } from "pinia";

// emits
const emit = defineEmits([
  "success",
  "selectedCurrency",
  "selectedFiat",
  "toAddress",
  "setQuotes",
  "selectedNetwork",
  "selectCurrency",
]);

const store = useGlobalStore();
const { selectedFiat, selectedCrypto, selectedNetwork, fiats } =
  storeToRefs(store);
const { setNetworks, setProviders } = store;

// data
const defaultFiatValue = "300";
const polkadot_chains = ["DOT", "KSM"];
const bitcoin_chains = ["BTC", "BCH", "DOGE", "LTC"];
const other_chains = ["KDA", "SOL"];

// eslint-disable-next-line no-undef
let priceTimer: NodeJS.Timer;

// non-reactive
const fiatFilter: Ref<string> = ref("");
const fiatItems: Ref<string[]> = ref([]);
const filteredFiatItems: Ref<string[]> = ref([]);
const updateFiatFilter = (value: string) => {
  if (value === "") {
    fiatFilter.value = value;
    filteredFiatItems.value = fiatItems.value;
  } else {
    const shallowArrayCopy = new Array(...fiatItems.value);
    fiatFilter.value = value;
    filteredFiatItems.value = shallowArrayCopy.filter((item) =>
      item.toLowerCase().includes(fiatFilter.value.toLowerCase())
    );
  }
};

// reactive
const price = ref("0");
const gasPrice = ref("0");
const form = reactive({
  fiatAmount: defaultFiatValue,
  fiatSelected: "USD",
  cryptoAmount: "0",
  cryptoSelected: "ETH",
  address: "",
  validAddress: false,
  addressErrorMsg: "",
  reCaptchaToken: "",
  addressError: false,
});
const loading = reactive({
  data: false,
  showAlert: false,
  processingBuyForm: false,
  alertMessage: "",
});
const dropdown = reactive({
  fiat: false,
  crypto: false,
});

onMounted(async () => {
  form.address = "";

  // Get crypto Data
  await getPrices();
  if (!isEmpty(selectedFiat.value)) {
    form.cryptoSelected = selectedCrypto.value.symbol;
    form.fiatSelected = selectedFiat.value.name;
    form.fiatAmount = "300";
    fiatToCrypto();
  } else {
    // Load URL parameter value and verify crypto address
    loadUrlParameters();
    if (form.fiatAmount === "0") {
      cryptoToFiat();
    }
  }
  // await fetchGasPrice();
  priceTimer = setInterval(getPrices, 1000 * 60 * 2);
  fiatToCrypto();
});

onUnmounted(async () => {
  clearInterval(priceTimer);
});

// watchers
watch(
  () => form.cryptoSelected,
  () => {
    verifyAddress();
    fiatToCrypto();
    minMaxError();
  }
);

watch(
  () => form.fiatSelected,
  () => {
    verifyAddress();
    cryptoToFiat();
    minMaxError();
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

// computed
const web3 = computed(() => {
  const supportedNodes: { [key: string]: string } = {
    ETH: "ETH",
    BNB: "BNB",
    MATIC: "MATIC",
    ARB: "ARB",
    OP: "OP",
  };
  const nodeType = supportedNodes[selectedCrypto.value.network];
  const node = Networks.find((network) => {
    return network.name === nodeType;
  });
  return new Web3(node ? node.url : "");
});

const networkFee = computed(() => {
  return fromWei(networkFeeWei.value);
});
const networkFeeWei = computed(() => {
  return toBN(gasPrice.value).muln(21000).toString();
});
const minFee = computed(() => {
  return toBN(399); // Minimum 3.99 in respective currency
});

const percentFee = computed(() => {
  return isEUR.value ? "0.7%" : "3.25%";
});
const isEUR = computed(() => {
  return form.fiatSelected === "EUR" || form.fiatSelected === "GBP";
});

const fiatCurrency = computed(() => {
  return { decimals: form.fiatSelected === "JPY" ? 0 : 2 };
});

const topperIncludesFeeText = computed(() => {
  return `Includes 4.65% fee. First transaction is free.`;
});

// Icons for selected token
const fiatIcon = computed(() => {
  return require(`@/assets/images/fiat/${form.fiatSelected}.svg`);
});
const cryptoIcon = computed(() => {
  if (
    form.cryptoSelected === "PYUSD" ||
    form.cryptoSelected === "FDUSD-SC" ||
    form.cryptoSelected === "TUSD"
  )
    return require(`@/assets/images/crypto/${form.cryptoSelected}.png`);
  if (form.cryptoSelected.includes("USDT"))
    return require(`@/assets/images/crypto/USDT.svg`);
  if (form.cryptoSelected.includes("USDC"))
    return require(`@/assets/images/crypto/USDC.svg`);
  return require(`@/assets/images/crypto/${form.cryptoSelected}.svg`);
});

// methods
const getIcon = (currency: string, isFiat = true) => {
  return require(`@/assets/images/${
    isFiat ? "fiat" : "crypto"
  }/${currency}.svg`);
};

const selectCurrency = (currency: string) => {
  form.fiatSelected = currency;
  dropdown.fiat = false;
  emit("selectedFiat", form.fiatSelected);
};

const isValidForm = computed(() => {
  return (
    form.fiatSelected &&
    form.cryptoSelected &&
    form.address &&
    !form.addressError &&
    form.addressErrorMsg === "" &&
    loading.alertMessage === "" &&
    form.validAddress
  );
});

const rules = [
  (e: any) => {
    if (isString(e) && e?.length >= 1) return true;
    if (!isNumber(e)) return "Must be a valid number";
    return true;
  },
];
const isValidData = (data: { [key: string]: Data }) => {
  const { cryptoSelected, fiatSelected } = form;
  return !isEmpty(data[cryptoSelected]?.limits[fiatSelected]);
};

const openTokenSelect = () => {
  emit(
    "selectedCurrency",
    {
      name: form.fiatSelected,
      value: form.fiatSelected,
      // eslint-disable-next-line
      img: require(`@/assets/images/fiat/${form.fiatSelected}.svg`),
    },
    form.fiatAmount
  );
};

const kdaValidator = (address: string) => {
  const kPrefixed = address.substr(0, 2) === "k:";
  const checkHex = isHex(address.substring(2));
  return kPrefixed && checkHex;
};

const addressValid = computed(() => {
  const address = form.address.toLowerCase();
  return other_chains.includes(form.cryptoSelected)
    ? form.cryptoSelected === "KDA"
      ? kdaValidator(address)
      : WAValidator.validate(address, form.cryptoSelected)
    : !polkadot_chains.includes(form.cryptoSelected)
    ? bitcoin_chains.includes(form.cryptoSelected)
      ? WAValidator.validate(address, form.cryptoSelected)
      : selectedNetwork.value.name === "OP" ||
        selectedNetwork.value.name === "ARB"
      ? WAValidator.validate(address, "ETH")
      : WAValidator.validate(address, form.cryptoSelected) &&
        validAddress(address)
    : isValidAddressPolkadotAddress(
        address,
        form.cryptoSelected === "DOT" ? 0 : 2
      );
});

const loadUrlParameters = () => {
  const queryString = window.location.search;
  if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    const queryCryptoAmount = urlParams.get("crypto_amount");
    const queryFiat = urlParams.get("fiat");
    const queryCrypto = urlParams.get("crypto");
    const queryTo = urlParams.get("to");

    // validate queries
    const isSupportedCrypto = supportedCrypto.find((cItem) => {
      if (cItem.toLowerCase() === queryCrypto?.toLowerCase()) {
        return queryCrypto;
      }
    });

    const isSupportedFiat = supportedCrypto.find((cItem) => {
      if (cItem.toLowerCase() === queryCrypto?.toLowerCase()) {
        return queryCrypto;
      }
    });

    const fiat = queryFiat && isSupportedFiat ? queryFiat.toUpperCase() : "USD";
    const crypto: string =
      queryCrypto && isSupportedCrypto ? queryCrypto.toUpperCase() : "ETH";
    form.fiatSelected = fiat;

    let tokensList;
    if (crypto !== selectedNetwork.value.name) {
      const network: Network | undefined = Networks.find((network) => {
        return network.name === crypto;
      });
      if (!network) return;
      // generate token list
      let decimals = 18;

      if (network.name === "DOT") decimals = 10;
      else if (network.name === "KSM") decimals = 12;
      const mainCoin = new Crypto(
        network.currencyName,
        network.name_long,
        network.name,
        decimals,
        network.icon
      );
      tokensList = [mainCoin];
      if (form.fiatSelected === "CAD") return tokensList;
      if (network.tokens) tokensList = tokensList.concat(network.tokens);
      emit("selectedNetwork", network);
    }
    const foundToken = tokensList
      ? tokensList.find((item) => {
          return item.symbol === crypto;
        })
      : undefined;
    if (foundToken) emit("selectCurrency", foundToken);
    form.cryptoSelected = foundToken ? foundToken.symbol : crypto;
    form.address = queryTo ? queryTo : "";
    if (queryTo) {
      verifyAddress();
    }
    const queryCryptoAmountHolder = BigNumber(
      queryCryptoAmount ? queryCryptoAmount : "1"
    );

    const locPriceOb = BigNumber(price.value);
    const locMin = BigNumber(min.value);
    const cryptoToFiat = BigNumber(
      queryCryptoAmountHolder.times(locPriceOb)
    ).lt(locMin)
      ? locMin.div(locPriceOb).times(10).toString()
      : queryCryptoAmountHolder;
    form.cryptoAmount = BigNumber(cryptoToFiat).toString();
  }
};

const errorHandler = (e: any): void => {
  const value = toBN(form.fiatAmount).gt(toBN(0));
  if (value) {
    const isErrorObj = isObject(e.response.data.error);
    console.log(isErrorObj);
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

const addressInput = (value: string): void => {
  form.address = value;
  verifyAddress();
};

const verifyAddress = (): void => {
  const valid = addressValid.value;
  if (valid) {
    form.addressErrorMsg = "";
    form.addressError = false;
    form.validAddress = true;
  } else {
    if (!form.address) {
      form.addressErrorMsg = "";
      form.validAddress = false;
    } else {
      form.addressErrorMsg = `Please provide a valid ${form.cryptoSelected} address`;
      form.validAddress = false;
    }
  }
};

const limits = computed(() => {
  const lim = fiats.value.get(form.fiatSelected)?.limits || {
    min: 0,
    max: 0,
  };

  return lim;
});

const min = computed(() => {
  return limits.value.min;
});
const max = computed(() => {
  return limits.value.max;
});

const minMaxError = () => {
  const amount = new BigNumber(form.fiatAmount);
  const valid =
    amount.gte(new BigNumber(min.value)) &&
    amount.lte(new BigNumber(max.value));

  if (!valid) {
    loading.showAlert = true;
    loading.alertMessage = `Fiat price must be between ${
      currencySymbols[form.fiatSelected]
    }${min.value} and ${currencySymbols[form.fiatSelected]}${max.value}`;
    return;
  }
  loading.showAlert = false;
  loading.alertMessage = "";
};

const concatenate = (value: string) => {
  return value.length > 3 ? `${value.slice(0, 3)}...` : value;
};

/**
 * Moonpay Fee calculations
 */
// const includesFeeText = computed(() => {
//   return `Includes ${percentFee.value} fee (${
//     formatFiatValue(fromBase(minFee.value.toString(), 2), currencyConfig.value)
//       .value
//   } min)`;
// });
// const networkFeeText = computed(() => {
//   return `${form.cryptoSelected} network fee (for transfers to your wallet) ~${
//     formatFiatValue(networkFeeToFiat.value.toString(), currencyConfig.value)
//       .value
//   }`;
// });
// const dailyLimit = (provider: string) => {
//   const simplexMax = isValidData(simplexData)
//     ? simplexData[form.cryptoSelected].limits[form.fiatSelected].max
//     : 0;
//   const moonpayMax = isValidData(moonpayData)
//     ? moonpayData[form.cryptoSelected].limits[form.fiatSelected].max
//     : 0;
//   const topperMax = isValidData(topperData)
//     ? topperData[form.cryptoSelected].limits[form.fiatSelected].max
//     : 0;
//   const value =
//     provider === "moonpay"
//       ? moonpayMax
//       : provider === "simplex"
//       ? simplexMax
//       : topperMax;
//   return `Daily limit: ${
//     formatFiatValue(value.toString(), currencyConfig.value).value
//   }`;
// };
// const monthlyLimit = () => {
//   const value = BigNumber(fiatMultiplier.value).times(50000);
//   return `Monthly limit: ${
//     formatFiatValue(value.toString(), currencyConfig.value).value
//   }`;
// };
// const currencyConfig = computed(() => {
//   const fiat = form.fiatSelected;
//   const rate =
//     moonpayData[form.cryptoSelected]?.conversion_rates[fiat] ||
//     simplexData[form.cryptoSelected]?.conversion_rates[fiat] ||
//     topperData[form.cryptoSelected]?.conversion_rates[fiat];
//   const currency = fiat;
//   return { locale: "en-US", rate, currency };
// });
// const fiatMultiplier = computed(() => {
//   if (hasData()) {
//     const selectedCurrencyPrice =
//       moonpayData[form.cryptoSelected]?.conversion_rates[form.fiatSelected];
//     return selectedCurrencyPrice
//       ? BigNumber(selectedCurrencyPrice).toString()
//       : toBN(1).toString();
//   }
//   return toBN(1).toString();
// });
// const priceOb = computed(() => {
//   return isValidData(moonpayData)
//     ? moonpayData[form.cryptoSelected].prices[form.fiatSelected]
//     : simplexData[form.cryptoSelected].prices[form.fiatSelected];
// });
// const networkPrice = computed(() => {
//   const moonpayPrice = isValidData(moonpayData)
//     ? moonpayData[form.cryptoSelected]?.prices[form.fiatSelected]
//     : undefined;
//   const simplexPrice = isValidData(simplexData)
//     ? simplexData[form.cryptoSelected]?.prices[form.fiatSelected]
//     : undefined;
//   const topperPrice = isValidData(topperData)
//     ? topperData[form.cryptoSelected]?.prices[form.fiatSelected]
//     : undefined;
//   return moonpayPrice
//     ? moonpayPrice
//     : simplexPrice
//     ? simplexPrice
//     : topperPrice
//     ? topperPrice
//     : "0";
// });
// const networkFeeToFiat = computed(() => {
//   return fromWei(
//     toBN(networkFeeWei.value).muln(parseFloat(networkPrice.value))
//   );
// });
// const plusFee = computed(() => {
//   const fiatAmount = toBN(toBase(parseFloat(form.fiatAmount), 2));
//   const fee = isEUR.value
//     ? fiatAmount.muln(0.007) // 0.7% SEPA fee
//     : fiatAmount.muln(0.0325); // Standard 3.25% fee
//   const withFee = fee.gt(minFee.value)
//     ? fiatAmount.sub(fee)
//     : fiatAmount.sub(fee).sub(minFee.value);
//   return fromBase(
//     withFee.subn(parseFloat(networkFeeToFiat.value)).toString(),
//     2
//   );
// });
// const plusFeeF = computed(() => {
//   const isAvailable = isValidData(moonpayData);
//   if (!isAvailable)
//     return `${form.cryptoSelected} is not available for this provider`;
//   const moonpayLimit =
//     moonpayData[form.cryptoSelected]?.limits[form.fiatSelected];
//   return moonpayLimit.max > Number.parseFloat(form.fiatAmount)
//     ? formatFiatValue(plusFee.value, currencyConfig.value).value
//     : `Value exceeds max: ${
//         formatFiatValue(moonpayLimit.max.toString(), currencyConfig.value).value
//       }`;
// });
// const moonpayCryptoAmount = computed(() => {
//   const moonpayAvailable = isValidData(moonpayData);
//   return moonpayAvailable
//     ? formatFloatingPointValue(
//         BigNumber(plusFee.value).div(priceOb.value).toString()
//       ).value
//     : "0";
// });
/**
 * Topper Calculations
 */
// const topperAvailable = computed(() => isValidData(topperData));
// const topperPrice = computed(() => {
//   return new BigNumber(
//     topperAvailable.value
//       ? topperData[form.cryptoSelected]?.prices[form.fiatSelected]
//       : "0"
//   );
// });
// const topperNetworkFeeText = computed(() => {
//   return `${form.cryptoSelected} network fee (for transfers to your wallet) ~${
//     formatFiatValue("0.2", currencyConfig.value).value
//   }`;
// });
// const topperFiatAmount = computed(() => {
//   return topperAvailable.value ? form.fiatAmount : "0.00";
// });
// const topperFiatFee = computed(() => {
//   return topperAvailable.value
//     ? BigNumber(topperFiatAmount.value)
//         .times(0.029)
//         .toFixed(fiatCurrency.value.decimals)
//     : 0;
// });
// const topperMewFiatFee = computed(() => {
//   return BigNumber(topperFiatAmount.value)
//     .times(0.0175)
//     .toFixed(fiatCurrency.value.decimals);
// });
// const topperPlusFee = computed(() => {
//   return BigNumber(topperFiatAmount.value)
//     .minus(topperFiatFee.value)
//     .minus(BigNumber(topperMewFiatFee.value))
//     .minus(0.2) // temp network fee
//     .toFixed(fiatCurrency.value.decimals);
// });
// const topperPlusFeeF = computed(() => {
//   return topperAvailable.value
//     ? formatFiatValue(topperFiatAmount.value, currencyConfig.value).value
//     : `${form.cryptoSelected} is not available for this provider`;
// });
// const topperCryptoAmount = computed(() => {
//   const amount = BigNumber(topperPlusFee.value || "0");
//   return topperAvailable.value
//     ? formatFloatingPointValue(
//         amount.dividedBy(topperPrice.value.toFixed(2)).toString()
//       ).value
//     : "0";
// });

/**
 * Simplex Fee calculations
 */
// const simplexAvailable = computed(() => isValidData(simplexData));
// const simplexPrice = computed(() => {
//   return new BigNumber(
//     simplexAvailable.value
//       ? simplexData[form.cryptoSelected]?.prices[form.fiatSelected]
//       : 0
//   );
// });
// const simplexFiatAmount = computed(() => {
//   return simplexAvailable.value ? form.fiatAmount : "0.00";
// });
// const simplexFiatFee = computed(() => {
//   const { fiatSelected, cryptoSelected } = form;
//   return simplexAvailable.value
//     ? calculateSimplexFiatFee(
//         Number.parseFloat(simplexFiatAmount.value),
//         {
//           price: simplexPrice.value.toNumber(),
//           fiatCurrency: fiatCurrency.value,
//         },
//         {
//           rate: simplexData[cryptoSelected].conversion_rates[fiatSelected],
//           baseRate: simplexData[cryptoSelected].conversion_rates["USD"],
//           fiatCurrency: fiatCurrency.value,
//         }
//       )
//     : 0;
// });
// const simplexPlusFee = computed(() => {
//   return BigNumber(simplexFiatAmount.value)
//     .minus(simplexFiatFee.value)
//     .toFixed(fiatCurrency.value.decimals);
// });
// const simplexPlusFeeF = computed(() =>
//   simplexAvailable.value
//     ? formatFiatValue(simplexPlusFee.value, currencyConfig.value).value
//     : `${form.cryptoSelected} is not available for this provider`
// );
// const simplexIncludesFeeText = computed(() => {
//   return `Includes 5.25% fee (${
//     formatFiatValue(BigNumber(10.0).toString(), currencyConfig.value).value
//   } min)`;
// });
// const simplexCryptoAmount = computed(() => {
//   const amount = BigNumber(simplexPlusFee.value || "0");
//   return simplexAvailable.value
//     ? formatFloatingPointValue(amount.dividedBy(simplexPrice.value).toString())
//         .value
//     : 0;
// });
// const hasData = () => {
//   return (
//     isValidData(simplexData) ||
//     isValidData(moonpayData) ||
//     isValidData(topperData)
//   );
// };
//
const getPrices = async () => {
  try {
    loading.data = true;
    const data = await fetch("https://qa.mewwallet.dev/v5/purchase/info");
    const response = await data.json();
    const { assets, providers } = response;
    setNetworks(assets);
    setProviders(providers);
    filteredFiatItems.value = Array.from(fiats.value.keys());
    fiatItems.value = Array.from(fiats.value.keys());
    cryptoToFiat();
  } catch (e: any) {
    loading.data = false;
    errorHandler(e);
  }
};
// Best price for display
// const bestPrice = computed(() => {
//   const { fiatSelected, cryptoSelected } = form;
//   const simplexPrice = new BigNumber(
//     simplexData[cryptoSelected]?.prices[fiatSelected]
//   );
//   const moonpayPrice = new BigNumber(
//     moonpayData[cryptoSelected]?.prices[fiatSelected]
//   );
//   const topperPrice = new BigNumber(
//     topperData[cryptoSelected]?.prices[fiatSelected]
//   );

//   if (moonpayPrice.isNaN() && topperPrice.isNaN()) return simplexPrice;
//   if (simplexPrice.isNaN() && topperPrice.isNaN()) return moonpayPrice;
//   if (simplexPrice.isNaN() && moonpayPrice.isNaN()) return topperPrice;
//   return simplexPrice.lte(moonpayPrice)
//     ? simplexPrice
//     : moonpayPrice.lte(topperPrice)
//     ? moonpayPrice
//     : topperPrice;
// });
//
const fiatToCrypto = debounce(() => {
  if (!isNaN(parseInt(form.fiatAmount))) {
    cryptoToFiat();
  } else {
    loading.alertMessage = "Please provide a valid fiat amount";
  }
}, 500);

const cryptoToFiat = async () => {
  try {
    loading.data = true;
    const priceFetch = await fetch(
      `https://qa.mewwallet.dev/v5/purchase/quote?fiatCurrency=${form.fiatSelected}&amount=${form.fiatAmount}&cryptoCurrency=${form.cryptoSelected}&chain=${selectedNetwork.value.name}`
    );
    const priceRespone = await priceFetch.json();
    const { crypto_price, crypto_amount } = priceRespone[0]; // get best rate
    form.cryptoAmount = crypto_amount;
    price.value = crypto_price;
    loading.data = false;
  } catch (e) {
    errorHandler(e);
    loading.data = false;
  }
};
// const submitForm = (): void => {
//   const { fiatSelected, cryptoSelected, address, fiatAmount } = form;
//   const moonpayAvailable = isValidData(moonpayData);
//   const moonpayOverMax = moonpayAvailable
//     ? moonpayData[cryptoSelected].limits[fiatSelected].max <
//       Number.parseFloat(fiatAmount)
//     : true;
//   const moonpayFiatAmount = moonpayAvailable ? fiatAmount : "0.00";
//   emit("success", {
//     topper_quote: {
//       cryptoToFiat: BigNumber(topperCryptoAmount.value).toString(),
//       selectedCryptoName: cryptoSelected,
//       plusFeeF: topperPlusFeeF.value,
//       includesFeeText: topperIncludesFeeText.value,
//       networkFeeText: topperNetworkFeeText.value,
//       dailyLimit: dailyLimit("topper"),
//       monthlyLimit: monthlyLimit(),
//       fiatAmount: topperFiatAmount.value,
//       fiatAmountF: formatFiatValue(topperFiatAmount.value, currencyConfig.value)
//         .value,
//       min: topperData[cryptoSelected]?.limits[fiatSelected]?.min || 50,
//     },
//     simplex_quote: {
//       cryptoToFiat: BigNumber(simplexCryptoAmount.value).toString(),
//       selectedCryptoName: cryptoSelected,
//       plusFeeF: simplexPlusFeeF.value,
//       includesFeeText: simplexIncludesFeeText.value,
//       networkFeeText: networkFeeText.value,
//       dailyLimit: dailyLimit("simplex"),
//       monthlyLimit: monthlyLimit(),
//       fiatAmount: simplexFiatAmount.value,
//       fiatAmountF: formatFiatValue(
//         simplexFiatAmount.value,
//         currencyConfig.value
//       ).value,
//       min: simplexData[cryptoSelected]?.limits[fiatSelected]?.min || 50,
//     },
//     address: address.toLowerCase(),
//     moonpay_quote: {
//       cryptoToFiat: BigNumber(moonpayCryptoAmount.value).toString(),
//       selectedCryptoName: cryptoSelected,
//       plusFeeF: plusFeeF.value,
//       includesFeeText: includesFeeText.value,
//       networkFeeText: networkFeeText.value,
//       dailyLimit: dailyLimit("moonpay"),
//       monthlyLimit: monthlyLimit(),
//       fiatAmount: moonpayFiatAmount,
//       fiatAmountF: formatFiatValue(moonpayFiatAmount, currencyConfig.value)
//         .value,
//       min: moonpayData[cryptoSelected]?.limits[fiatSelected]?.min || 50,
//     },
//     open_providers: 2,
//     selected_currency: selectedCrypto.value,
//     selected_fiat: {
//       name: fiatSelected,
//       value: fiatSelected,
//       // eslint-disable-next-line
//       img: require(`@/assets/images/fiat/${fiatSelected}.svg`),
//     },
//     fiat_amount: fiatAmount,
//     disable_moonpay: !moonpayAvailable || moonpayOverMax,
//   });
// };
//
// const fetchGasPrice = async (): Promise<void> => {
//   if (
//     polkadot_chains.includes(form.cryptoSelected) ||
//     bitcoin_chains.includes(form.cryptoSelected) ||
//     other_chains.includes(form.cryptoSelected)
//   ) {
//     gasPrice.value = "0";
//     return;
//   }
//   gasPrice.value = await web3.value.eth.getGasPrice();
//   const price = isValidData(simplexData)
//     ? simplexData[form.cryptoSelected]?.prices[form.fiatSelected]
//     : moonpayData[form.cryptoSelected]?.prices[form.fiatSelected];
//   init(parseFloat(networkFee.value) * parseFloat(price));
// };
</script>

<style lang="scss" scoped>
.buy-button {
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-btn-linear-1)) 0%,
    rgba(var(--v-theme-btn-linear-2)) 100%
  );
}
</style>

<style lang="scss">
.buy-input {
  .v-input__control {
    height: 56px !important;
  }
}

// Hide input arrows
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.v-combobox__selection-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.components--buy-form {
  .v-field__outline__end,
  .v-field__outline__notch::after,
  .v-field__outline__start {
    border-color: #c2c2c2 !important;
  }

  .error-state {
    height: 56px !important;

    .v-input__control {
      height: 56px !important;
    }

    .v-field {
      height: 56px !important;
      .v-field__field {
        height: 56px !important;
      }

      .v-field__outline {
        height: 56px !important;
      }
      .v-field__overlay {
        height: 56px !important;
      }
    }
  }

  .no-right-border {
    .v-field__outline__end {
      border-radius: 0 !important;
    }
  }
  .no-left-border {
    .v-field__outline__start {
      border-radius: 0 !important;
    }
  }
}

@media screen and (min-width: 960px) and (max-width: 1279px) {
  .no-right-border {
    max-width: 282px !important;
  }
}
@media screen and (max-width: 1900px) {
  .no-right-border {
    max-width: 282px !important;
  }
}

.custom-btn {
  width: 130px !important;
  height: 56px !important;
  border: 1px solid rgba(211, 211, 211, 0.5);
  border-radius: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  font-size: 14px;
  font-weight: normal;

  &:hover {
    border: 1px solid rgba(211, 211, 211, 1);
  }
}

.full-button {
  @extend .custom-btn;
  width: 100% !important;
  display: flex;
  justify-content: space-between;
}
</style>
