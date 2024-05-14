<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <div class="pa-3 pa-sm-2 pa-md-2 components--buy-form" ref="formDiv">
    <!-- ============================================================================= -->
    <!-- Fiat amount -->
    <!-- ============================================================================= -->
    <div class="mb-6 mt-6">
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="mew-heading-4 textDark--text">
          How much do you want to spend?
        </div>
        <div v-if="loading.data" class="ml-2 d-flex align-center">
          <span class="h3 font-weight-regular mr-1">Loading</span>
          <v-progress-circular
            :size="11"
            :width="2"
            indeterminate
          ></v-progress-circular>
        </div>
      </div>
      <div class="d-flex mt-2">
        <v-text-field
          class="no-right-border"
          @input="fiatToCrypto"
          type="number"
          v-model.number="form.fiatAmount"
          required
          variant="outlined"
          :error-messages="loading.alertMessage"
          :disabled="loading.data"
          :rules="rules"
        ></v-text-field>
        <v-select
          style="max-width: 120px"
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
    </div>

    <!-- ============================================================================= -->
    <!-- Crypto amount -->
    <!-- ============================================================================= -->
    <div class="mb-6">
      <div class="mew-heading-4 textDark--text mb-3">You will get</div>
      <div class="d-flex mt-2">
        <v-text-field
          class="no-right-border"
          @input="cryptoToFiat"
          type="number"
          v-model.number="form.cryptoAmount"
          required
          variant="outlined"
          rounded="left"
          :rules="rules"
          :disabled="loading.data"
        ></v-text-field>
        <v-btn
          rounded="right"
          variant="outlined"
          class="no-left-border custom-btn"
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
            {{ form.cryptoSelected }}
          </span>
          <template v-slot:append>
            <v-icon color="grey-2" size="large"></v-icon>
          </template>
        </v-btn>
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
        label=""
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
          flat
          rounded="pill"
          :disabled="!isValidForm"
          min-height="60px"
          width="360px"
          @click="submitForm"
          class="buy-button"
        >
          <div class="text-white font-weight-bold">BUY NOW</div>
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
} from "./prices";
import { isObject, isNumber, isString, isEmpty } from "lodash";
import WAValidator from "multicoin-address-validator";
import { isHexStrict, isAddress, fromWei, toBN, isHex } from "web3-utils";
import { encodeAddress } from "@polkadot/keyring";
import MewAddressSelect from "../MewAddressSelect/MewAddressSelect.vue";
import {
  formatFiatValue,
  formatFloatingPointValue,
} from "@/helpers/numberFormatHelper";
import { Networks } from "./network/networks";
import { Crypto, Data, Network, Fiat } from "./network/types";
import Web3 from "web3";
import { init, calculateFiatFee } from "./models/purchaseSimplexFeeModel";
import { fromBase, toBase } from "@/helpers/units";

const defaultFiatValue = "0";
let gasPrice = "0";
const polkadot_chains = ["DOT", "KSM"];
const bitcoin_chains = ["BTC", "BCH", "DOGE", "LTC"];
const other_chains = ["KDA"];
// eslint-disable-next-line no-undef
let priceTimer: NodeJS.Timer;
let fiatFilter = "";

onMounted(async () => {
  form.address = "";

  // Get crypto Data
  await getPrices();
  if (!isEmpty(props.fiatSelected)) {
    form.cryptoSelected = props.cryptoSelected.symbol;
    form.fiatSelected = props.fiatSelected.name;
    form.fiatAmount = props.fiatAmount;
    fiatToCrypto();
  } else {
    // Load URL parameter value and verify crypto address
    loadUrlParameters();
    if (form.fiatAmount === "0") {
      cryptoToFiat();
    }
  }
  await fetchGasPrice();
  priceTimer = setInterval(getPrices, 1000 * 60 * 2);
});

onUnmounted(async () => {
  clearInterval(priceTimer);
});

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

// props
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
    default: "0",
  },
});

// data

// non-reactive
const fiatItems: string[] = supportedFiat;
const filteredFiatItems: Ref<string[]> = ref(fiatItems);
const updateFiatFilter = (value: string) => {
  fiatFilter = value;
  filteredFiatItems.value = fiatItems.filter((item) =>
    item.toLowerCase().includes(fiatFilter.toLowerCase())
  );
};

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
  fiatSelected: "USD",
  cryptoAmount: "1",
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
  const nodeType = supportedNodes[props.cryptoSelected.network];
  const node = Networks.find((network) => {
    return network.name === nodeType;
  });
  return new Web3(node ? node.url : "");
});

/**
 * Moonpay Fee calculations
 */
const includesFeeText = computed(() => {
  return `Includes ${percentFee.value} fee (${
    formatFiatValue(fromBase(minFee.value.toString(), 2), currencyConfig.value)
      .value
  } min)`;
});
const networkFeeText = computed(() => {
  return `${form.cryptoSelected} network fee (for transfers to your wallet) ~${
    formatFiatValue(networkFeeToFiat.value.toString(), currencyConfig.value)
      .value
  }`;
});
const dailyLimit = (isMoonpay = false) => {
  const simplexMax = isValidData(simplexData)
    ? simplexData[form.cryptoSelected].limits[form.fiatSelected].max
    : 0;
  const moonpayMax = isValidData(moonpayData)
    ? moonpayData[form.cryptoSelected].limits[form.fiatSelected].max
    : 0;
  const value = isMoonpay ? moonpayMax : simplexMax;
  return `Daily limit: ${
    formatFiatValue(value.toString(), currencyConfig.value).value
  }`;
};
const monthlyLimit = () => {
  const value = BigNumber(fiatMultiplier.value).times(50000);
  return `Monthly limit: ${
    formatFiatValue(value.toString(), currencyConfig.value).value
  }`;
};
const currencyConfig = computed(() => {
  const fiat = form.fiatSelected;
  const rate =
    moonpayData[form.cryptoSelected]?.conversion_rates[fiat] ||
    simplexData[form.cryptoSelected]?.conversion_rates[fiat];
  const currency = fiat;
  return { locale: "en-US", rate, currency };
});
const fiatMultiplier = computed(() => {
  if (hasData()) {
    const selectedCurrencyPrice =
      moonpayData[form.cryptoSelected]?.conversion_rates[form.fiatSelected];
    return selectedCurrencyPrice
      ? BigNumber(selectedCurrencyPrice).toString()
      : toBN(1).toString();
  }
  return toBN(1).toString();
});
const networkFee = computed(() => {
  return fromWei(networkFeeWei.value);
});
const networkFeeWei = computed(() => {
  return toBN(gasPrice).muln(21000).toString();
});
const priceOb = computed(() => {
  return isValidData(moonpayData)
    ? moonpayData[form.cryptoSelected].prices[form.fiatSelected]
    : simplexData[form.cryptoSelected].prices[form.fiatSelected];
});
const networkPrice = computed(() => {
  return isValidData(moonpayData)
    ? moonpayData[props.networkSelected.currencyName].prices[form.fiatSelected]
    : simplexData[props.networkSelected.currencyName].prices[form.fiatSelected];
});
const networkFeeToFiat = computed(() => {
  return fromWei(
    toBN(networkFeeWei.value).muln(parseFloat(networkPrice.value))
  );
});
const minFee = computed(() => {
  return toBN(399); // Minimum 3.99 in respective currency
});
const plusFee = computed(() => {
  const fiatAmount = toBN(toBase(parseFloat(form.fiatAmount), 2));
  const fee = isEUR.value
    ? fiatAmount.muln(0.007) // 0.7% SEPA fee
    : fiatAmount.muln(0.0325); // Standard 3.25% fee
  const withFee = fee.gt(minFee.value)
    ? fiatAmount.sub(fee)
    : fiatAmount.sub(fee).sub(minFee.value);
  return fromBase(
    withFee.subn(parseFloat(networkFeeToFiat.value)).toString(),
    2
  );
});
const plusFeeF = computed(() => {
  const isAvailable = isValidData(moonpayData);
  if (!isAvailable)
    return `${form.cryptoSelected} is not available for this provider`;
  const moonpayLimit =
    moonpayData[form.cryptoSelected]?.limits[form.fiatSelected];
  return moonpayLimit.max > Number.parseFloat(form.fiatAmount)
    ? formatFiatValue(plusFee.value, currencyConfig.value).value
    : `Value exceeds max: ${
        formatFiatValue(moonpayLimit.max.toString(), currencyConfig.value).value
      }`;
});
const percentFee = computed(() => {
  return isEUR.value ? "0.7%" : "3.25%";
});
const isEUR = computed(() => {
  return form.fiatSelected === "EUR" || form.fiatSelected === "GBP";
});

const moonpayCryptoAmount = computed(() => {
  const moonpayAvailable = isValidData(moonpayData);
  return moonpayAvailable
    ? formatFloatingPointValue(
        BigNumber(plusFee.value).div(priceOb.value).toString()
      ).value
    : 0;
});

/**
 * Simplex Fee calculations
 */
const simplexAvailable = computed(() => isValidData(simplexData));
const fiatCurrency = computed(() => {
  return { decimals: form.fiatSelected === "JPY" ? 0 : 2 };
});
const simplexPrice = computed(() => {
  return new BigNumber(
    simplexAvailable.value
      ? simplexData[form.cryptoSelected]?.prices[form.fiatSelected]
      : 0
  );
});
const simplexFiatAmount = computed(() => {
  return simplexAvailable.value ? form.fiatAmount : "0.00";
});
const simplexFiatFee = computed(() => {
  const { fiatSelected, cryptoSelected } = form;
  return simplexAvailable.value
    ? calculateFiatFee(
        Number.parseFloat(simplexFiatAmount.value),
        {
          price: simplexPrice.value.toNumber(),
          fiatCurrency: fiatCurrency.value,
        },
        {
          rate: simplexData[cryptoSelected].conversion_rates[fiatSelected],
          baseRate: simplexData[cryptoSelected].conversion_rates["USD"],
          fiatCurrency: fiatCurrency.value,
        }
      )
    : 0;
});
const simplexPlusFee = computed(() => {
  return BigNumber(simplexFiatAmount.value)
    .minus(simplexFiatFee.value)
    .toFixed(fiatCurrency.value.decimals);
});
const simplexPlusFeeF = computed(() =>
  simplexAvailable.value
    ? formatFiatValue(simplexPlusFee.value, currencyConfig.value).value
    : `${form.cryptoSelected} is not available for this provider`
);
const simplexIncludesFeeText = computed(() => {
  return `Includes 5.25% fee (${
    formatFiatValue(BigNumber(10.0).toString(), currencyConfig.value).value
  } min)`;
});
const simplexCryptoAmount = computed(() => {
  const amount = BigNumber(simplexPlusFee.value || "0");
  return simplexAvailable.value
    ? formatFloatingPointValue(amount.dividedBy(simplexPrice.value).toString())
        .value
    : 0;
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
    minMax.value &&
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
const hasData = () => {
  return isValidData(simplexData) || isValidData(moonpayData);
};
const min = computed(() => {
  const { cryptoSelected, fiatSelected } = form;
  if (!hasData()) return 0;
  const simplexLimit = simplexData[cryptoSelected]?.limits[fiatSelected];
  const moonpayLimit = moonpayData[cryptoSelected]?.limits[fiatSelected];
  if (!isValidData(moonpayData)) return simplexLimit.min;
  if (!isValidData(simplexData)) return moonpayLimit.min;
  return moonpayLimit.min < simplexLimit.min
    ? moonpayLimit.min
    : simplexLimit.min;
});
const max = computed(() => {
  const { cryptoSelected, fiatSelected } = form;
  if (!hasData()) return 0;
  const simplexLimit = simplexData[cryptoSelected]?.limits[fiatSelected];
  const moonpayLimit = moonpayData[cryptoSelected]?.limits[fiatSelected];
  if (!isValidData(moonpayData)) return simplexLimit.max;
  if (!isValidData(simplexData)) return moonpayLimit.max;
  return moonpayLimit.max > simplexLimit.max
    ? moonpayLimit.max
    : simplexLimit.max;
});
const minMax = computed(() => {
  const { fiatAmount } = form;
  if (!hasData()) return false;
  const limit = { min: min.value, max: max.value };
  const amount = new BigNumber(fiatAmount || 0);
  const valid =
    amount.gte(new BigNumber(limit.min)) &&
    amount.lte(new BigNumber(limit.max));
  return valid;
});

const minMaxError = () => {
  const limit = { min: min.value, max: max.value };
  if (!minMax.value) {
    loading.showAlert = true;
    loading.alertMessage = `Fiat price must be between ${
      currencySymbols[form.fiatSelected]
    }${limit.min} and ${currencySymbols[form.fiatSelected]}${limit.max}`;
    return;
  }
  loading.showAlert = false;
  loading.alertMessage = "";
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
          if (l.type === "WEB") tmp.limits[l.fiat_currency] = l.limit;
        });
        d.prices.forEach((p: any) => (tmp.prices[p.fiat_currency] = p.price));
        const tokenName = d.crypto_currencies[0];
        if (d.name === "SIMPLEX") simplexData[tokenName] = tmp;
        else if (d.name === "MOONPAY") moonpayData[tokenName] = tmp;
      });
    });
    loading.data = false;
    emit("setQuotes", simplexData, moonpayData);
  } catch (e: any) {
    errorHandler(e);
  }
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
  return other_chains.includes(form.cryptoSelected)
    ? form.cryptoSelected === "KDA"
      ? kdaValidator(form.address)
      : WAValidator.validate(form.address, form.cryptoSelected)
    : !polkadot_chains.includes(form.cryptoSelected)
    ? bitcoin_chains.includes(form.cryptoSelected)
      ? WAValidator.validate(form.address, form.cryptoSelected)
      : WAValidator.validate(form.address, props.networkSelected.name) &&
        validAddress(form.address)
    : isValidAddressPolkadotAddress(
        form.address,
        form.cryptoSelected === "DOT" ? 0 : 2
      );
});

// Best price for display
const bestPrice = computed(() => {
  const { fiatSelected, cryptoSelected } = form;
  const simplexPrice = new BigNumber(
    simplexData[cryptoSelected]?.prices[fiatSelected]
  );
  const moonpayPrice = new BigNumber(
    moonpayData[cryptoSelected]?.prices[fiatSelected]
  );
  if (moonpayPrice.isNaN()) return simplexPrice;
  if (simplexPrice.isNaN()) return moonpayPrice;
  return simplexPrice.lte(moonpayPrice) ? simplexPrice : moonpayPrice;
});

const fiatToCrypto = () => {
  const price = bestPrice.value;
  const amount = new BigNumber(form.fiatAmount || "0");
  form.cryptoAmount = BigNumber(amount).div(price).toString();
};

const cryptoToFiat = () => {
  const price = bestPrice.value;
  const amount = new BigNumber(form.cryptoAmount || "0");
  form.fiatAmount = amount.times(price).toFixed(2).toString();
};

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
    const crypto =
      queryCrypto && isSupportedCrypto ? queryCrypto.toUpperCase() : "ETH";
    form.fiatSelected = fiat;

    let tokensList;
    if (crypto !== props.networkSelected.name) {
      const network = Networks.find((network) => {
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

    const locPriceOb = BigNumber(priceOb.value);
    const locMin = BigNumber(min.value);
    const cryptoToFiat = BigNumber(
      queryCryptoAmountHolder.times(locPriceOb)
    ).lt(locMin)
      ? locMin.div(locPriceOb).times(10).toString()
      : queryCryptoAmountHolder;
    form.cryptoAmount = BigNumber(cryptoToFiat).toNumber();
  }
};

const errorHandler = (e: any): void => {
  const value = toBN(form.fiatAmount).gt(toBN(0));
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

const submitForm = (): void => {
  const { fiatSelected, cryptoSelected, address, fiatAmount } = form;
  const moonpayAvailable = isValidData(moonpayData);
  const moonpayOverMax = moonpayAvailable
    ? moonpayData[cryptoSelected].limits[fiatSelected].max <
      Number.parseFloat(fiatAmount)
    : true;

  const moonpayFiatAmount = moonpayAvailable ? fiatAmount : "0.00";
  emit("success", {
    simplex_quote: {
      cryptoToFiat: simplexCryptoAmount.value,
      selectedCryptoName: cryptoSelected,
      plusFeeF: simplexPlusFeeF.value,
      includesFeeText: simplexIncludesFeeText,
      networkFeeText: networkFeeText,
      dailyLimit: dailyLimit(),
      monthlyLimit: monthlyLimit(),
      fiatAmount: simplexFiatAmount.value,
    },
    address: address,
    buy_obj: {
      cryptoToFiat: moonpayCryptoAmount,
      selectedCryptoName: cryptoSelected,
      plusFeeF: plusFeeF,
      includesFeeText: includesFeeText,
      networkFeeText: networkFeeText,
      dailyLimit: dailyLimit(true),
      monthlyLimit: monthlyLimit(),
      fiatAmount: moonpayFiatAmount,
    },
    open_providers: 2,
    selected_currency: props.cryptoSelected,
    selected_fiat: {
      name: fiatSelected,
      value: fiatSelected,
      // eslint-disable-next-line
      img: require(`@/assets/images/fiat/${fiatSelected}.svg`),
    },
    fiat_amount: fiatAmount,
    disable_moonpay: !moonpayAvailable || moonpayOverMax,
  });
};

const fetchGasPrice = async (): Promise<void> => {
  if (
    polkadot_chains.includes(form.cryptoSelected) ||
    bitcoin_chains.includes(form.cryptoSelected) ||
    other_chains.includes(form.cryptoSelected)
  ) {
    gasPrice = "0";
    return;
  }
  gasPrice = await web3.value.eth.getGasPrice();
  const price = isValidData(simplexData)
    ? simplexData[form.cryptoSelected]?.prices[form.fiatSelected]
    : moonpayData[form.cryptoSelected]?.prices[form.fiatSelected];
  init(parseFloat(networkFee.value) * parseFloat(price));
};
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

// Adjust (text field) prefix font size
.v-messages__message {
  font-weight: 300;
  font-size: 0.9rem;
  color: red;
}

.v-combobox__selection-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.components--buy-form {
  .v-field__outline__end,
  .v-field__outline__start {
    border-color: #c2c2c2;
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
.custom-btn {
  max-width: 120px !important;
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
</style>
