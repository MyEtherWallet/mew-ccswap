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
          @click="toggleTokenModal"
        >
          <template #prepend>
            <img
              class="currency-icon mr-1 padding--2"
              :src="selectedCrypto.img"
              :alt="form.cryptoSelected"
              width="25px"
              height="25px"
            />
          </template>
          <span> {{ selectedCrypto.symbol }} - {{ selectedCrypto.name }} </span>
          <template v-slot:append>
            <v-icon color="grey-2" size="large"></v-icon>
          </template>
        </v-btn>
        <div class="mt-2 mx-4">Network: {{ selectedNetwork.name_long }}</div>
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
          :list-props="{ density: 'compact' }"
          base-color="primary"
          return-object
          variant="outlined"
        >
          <template #prepend-inner>
            <div class="currency-container">
              <img
                :src="selectedFiat.img"
                :alt="form.fiatSelected"
                width="30px"
                height="30px"
              />
            </div>
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
              @click.stop="(e) => e.preventDefault()"
            />
          </template>
          <template #item="{ item, props }">
            <v-list-item
              v-bind="props"
              class="d-flex align-center justify-space-between full-width cursor-pointer"
              @click="selectCurrency(item.value)"
            >
              <template #title>
                <div class="d-flex align-center">
                  <div class="currency-container mr-1 ml-3">
                    <img
                      :src="getIcon(item.value)"
                      :alt="item.value"
                      width="30px"
                      height="30px"
                    />
                  </div>
                  <span class="text-capitalize ml-2 my-2 d-flex flex-column">{{
                    item.value
                  }}</span>
                </div>
              </template>
            </v-list-item>
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
    <div
      v-if="form.quoteError"
      class="text-bolder text-error mew-heading-4 text-center"
    >
      <span class="text-gray">{{ form.quoteError }}</span>
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
  onUnmounted,
  ref,
  Ref,
  defineEmits,
  defineProps,
} from "vue";
import BigNumber from "bignumber.js";
import { storeToRefs } from "pinia";
import { currencySymbols } from "./handler/prices";
import { isObject, isNumber, isString, isEmpty, debounce } from "lodash";
import addressValidator from "@/helpers/addressValidator";
import { sha3 } from "web3-utils";

import { useGlobalStore } from "@/plugins/globalStore";

import MewAddressSelect from "../MewAddressSelect/MewAddressSelect.vue";
import { Network } from "./network/types";
import api from "./handler/api";
import enkryptNetworkMap from "@/helpers/enkryptNetworkMap";

const props = defineProps({
  heldAddress: {
    type: String,
    default: "",
  },
});

const store = useGlobalStore();
const {
  selectedFiat,
  selectedCrypto,
  selectedNetwork,
  buyFiats,
  buyNetworks,
  allCryptos,
  conversionRates,
} = storeToRefs(store);
const {
  setNetworks,
  setSelectedCrypto,
  setSelectedNetwork,
  setProviders,
  setBuyProviders,
  toggleTokenModal,
  setSelectedFiat,
  toggleBuyProviders,
} = store;

// data
const defaultFiatValue = "300";

// nonreactive
const rules = [
  (e: any) => {
    if (isString(e) && e?.length >= 1) return true;
    if (!isNumber(e)) return "Must be a valid number";
    return true;
  },
];

const emit = defineEmits(["addressInput"]);

// reactive
// eslint-disable-next-line no-undef
let priceTimer: NodeJS.Timer;

const fiatFilter: Ref<string> = ref("");
const fiatItems: Ref<string[]> = ref([]);
const filteredFiatItems: Ref<string[]> = ref([]);
const price = ref("0");
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
  quoteError: "",
});
const loading = reactive({
  data: false,
  showAlert: false,
  processingBuyForm: false,
  alertMessage: "",
});

onMounted(async () => {
  addressInput(props.heldAddress);
  // Get crypto Data
  await getPrices();
  if (!isEmpty(selectedFiat.value)) {
    form.cryptoSelected = selectedCrypto.value.symbol;
    form.fiatSelected = selectedFiat.value.name;
    form.fiatAmount = "300";
  }
  // Load URL parameter value and verify crypto address
  loadUrlParameters();
  priceTimer = setInterval(getPrices, 1000 * 60);
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
  (newVal, oldVal) => {
    if (oldVal === "USD") {
      form.fiatAmount = BigNumber(form.fiatAmount)
        .times(conversionRates.value.get(newVal))
        .toFixed(2);
    } else {
      const backToUsd = BigNumber(form.fiatAmount)
        .div(conversionRates.value.get(oldVal))
        .toFixed(2);
      form.fiatAmount = BigNumber(backToUsd)
        .times(conversionRates.value.get(newVal))
        .toFixed(2);
    }
    verifyAddress();
    cryptoToFiat();
    minMaxError();

    buyFiats.value.forEach((value, key) => {
      if (key === newVal) {
        setSelectedFiat({
          name: key,
          value: key,
          img: require(`@/assets/images/fiat/${key}.svg`),
        });
      }
    });
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
const isValidForm = computed(() => {
  return (
    form.fiatSelected &&
    form.cryptoSelected &&
    form.address &&
    !form.addressError &&
    form.addressErrorMsg === "" &&
    loading.alertMessage === "" &&
    form.validAddress &&
    form.quoteError === ""
  );
});

const addressValid = computed(() => {
  return addressValidator(form.address, selectedNetwork.value.name);
});

const limits = computed(() => {
  const lim = buyFiats.value.get(form.fiatSelected)?.limits || {
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

// methods
const getIcon = (currency: string, isFiat = true) => {
  return require(`@/assets/images/${
    isFiat ? "fiat" : "crypto"
  }/${currency}.svg`);
};

const selectCurrency = (currency: string) => {
  form.fiatSelected = currency;
  setSelectedFiat({
    name: currency,
    value: currency,
    img: require(`@/assets/images/fiat/${currency}.svg`),
  });
};

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

const loadUrlParameters = () => {
  const queryString = window.location.search;
  if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    const queryFiat = urlParams.get("fiat");
    const queryCrypto = urlParams.get("crypto");
    const queryTo = urlParams.get("to");
    const queryNetwork = urlParams.get("network");
    const locParsedNetwork = enkryptNetworkMap(queryNetwork || "ETH")
      ? enkryptNetworkMap(queryNetwork as string)
      : "ETH";
    // validate queries
    const isSupportedCrypto = allCryptos.value.find((cItem) => {
      if (
        cItem.symbol.toLowerCase() === queryCrypto?.toLowerCase() &&
        locParsedNetwork?.toLowerCase() === cItem.network.toLowerCase()
      ) {
        return queryCrypto;
      }
    });

    const supportedNetwork = buyNetworks.value.find((network: Network) => {
      if (network.name.toLowerCase() === locParsedNetwork?.toLowerCase()) {
        return locParsedNetwork;
      }
    });

    const isSupportedFiat = buyFiats.value.get(
      queryFiat?.toUpperCase() || "USD"
    );

    form.fiatSelected = isSupportedFiat?.fiat_currency || "USD";
    form.cryptoSelected = isSupportedCrypto?.symbol || "ETH";

    if (isSupportedCrypto && supportedNetwork) {
      setSelectedCrypto(isSupportedCrypto);
      setSelectedNetwork(supportedNetwork);
    }
    if (isSupportedFiat) {
      setSelectedFiat({
        name: isSupportedFiat.fiat_currency,
        value: isSupportedFiat.fiat_currency,
        img: require(`@/assets/images/fiat/${isSupportedFiat.fiat_currency}.svg`),
      });
    }
    if (queryTo) {
      form.address = queryTo ? queryTo : "";
      verifyAddress();
    }
  }
};

const errorHandler = (e: any): void => {
  const value = BigNumber(form.fiatAmount).gt(BigNumber(0));
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

const addressInput = (value: string): void => {
  form.address = value;
  emit("addressInput", value);
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

const minMaxError = () => {
  const amount = new BigNumber(form.fiatAmount);
  const valid =
    amount.gte(new BigNumber(min.value)) &&
    amount.lte(new BigNumber(max.value));

  if (!valid) {
    const symbol = currencySymbols[form.fiatSelected]
      ? currencySymbols[form.fiatSelected]
      : "";
    loading.showAlert = true;
    loading.alertMessage = `Fiat price must be between ${symbol}${min.value} and ${symbol}${max.value}`;
    return;
  }
  loading.showAlert = false;
  loading.alertMessage = "";
};

const getPrices = async () => {
  try {
    loading.data = true;
    const data = await fetch(
      `${api.endpoint}/v5/purchase/info?includeMarketData=true`
    );
    const response = await data.json();
    const { msg } = response;
    if (msg) {
      form.quoteError = msg;
      loading.data = false;
      return;
    }
    const { assets, providers } = response;
    setNetworks(assets);
    setProviders(providers);
    fiatItems.value = Array.from(buyFiats.value.keys());
    filteredFiatItems.value = Array.from(fiatItems.value);
    loading.data = false;
  } catch (e: any) {
    loading.data = false;
    errorHandler(e);
  }
};

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
    form.quoteError = "";
    const priceFetch = await fetch(
      `${api.endpoint}/v5/purchase/quote?fiatCurrency=${selectedFiat.value.name}&amount=${form.fiatAmount}&cryptoCurrency=${selectedCrypto.value.symbol}&chain=${selectedNetwork.value.name}`
    );
    const priceResponse = await priceFetch.json();

    if (priceResponse.msg) {
      form.quoteError = priceResponse.msg;
      loading.data = false;
      return;
    }
    form.cryptoAmount = priceResponse[0].crypto_amount;
    price.value = priceResponse[0].crypto_price;
    loading.data = false;
  } catch (e) {
    errorHandler(e);
    loading.data = false;
  }
};

const submitForm = async (): Promise<void> => {
  try {
    loading.data = true;
    const { fiatAmount, address } = form;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const platform = urlParams.get("platform") || "web";
    const id = sha3(address)?.substring(0, 42);
    const providersFetch = await fetch(
      `${api.endpoint}/v5/purchase/buy?id=${id}&address=${address}&fiatCurrency=${selectedFiat.value.name}&amount=${fiatAmount}&cryptoCurrency=${selectedCrypto.value.symbol}&chain=${selectedNetwork.value.name}&iso=US&platform=${platform}`
    );
    const providers = await providersFetch.json();
    if (providers.msg || providers.error) {
      loading.data = false;
      loading.alertMessage = providers.msg || providers.error;
      return;
    }
    setBuyProviders(providers);
    toggleBuyProviders();
    loading.data = false;
  } catch (e) {
    loading.data = false;
    errorHandler(e);
  }
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
@media screen and (min-width: 1280px) and (max-width: 1899px) {
  .no-right-border {
    max-width: 500px !important;
  }
}
@media screen and (min-width: 1900px) {
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

.currency-container {
  border-radius: 50%;
  border: 2px solid silver;
  width: 24px;
  height: 24px;
  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    top: -5px;
    right: -5px;
  }
}
</style>
