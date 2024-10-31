<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <div class="pa-3 pa-sm-2 pa-md-2 components--sell-form" ref="formDiv">
    <!-- ============================================================================= -->
    <!-- Crypto amount -->
    <!-- ============================================================================= -->
    <div class="mb-6 mt-6">
      <div class="d-flex justify-space-between mb-3">
        <div class="mew-heading-4 textDark--text">
          How much do you want to sell?
        </div>
        <div v-if="!loading.data" class="text-mew">
          <!-- Balance: {{ displayBalance() }} -->
        </div>
      </div>
      <div class="d-flex mt-2">
        <v-text-field
          type="number"
          v-model="form.cryptoAmount"
          required
          variant="outlined"
          rounded="left"
          hide-details="auto"
          :rules="rules"
          :disabled="loading.data"
          :error="form.balanceError"
          class="no-right-border"
          @input="cryptoToAmount"
        ></v-text-field>
        <v-btn
          v-model="form.cryptoSelected"
          rounded="right"
          variant="outlined"
          class="no-left-border custom-btn"
          @click="openTokenSelect"
          append-icon="mdi-menu-down"
          style="max-width: 130px"
          :disabled="loading.data"
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
          <span>
            {{ form.cryptoSelected }}
          </span>
          <template v-slot:append>
            <v-icon color="grey-2" size="large"></v-icon>
          </template>
        </v-btn>
      </div>
      <div class="mt-2 mx-4">Network: {{ selectedNetwork.name_long }}</div>
    </div>

    <!-- ============================================================================= -->
    <!-- Fiat amount -->
    <!-- ============================================================================= -->
    <div class="mb-6">
      <div class="mew-heading-4 textDark--text mb-3">You will get</div>
      <div class="d-flex mt-2">
        <v-text-field
          type="number"
          v-model="form.fiatAmount"
          required
          variant="outlined"
          rounded="left"
          :rules="fiatRules"
          :error-messages="loading.alertMessage"
          :disabled="loading.data"
          class="no-right-border"
          @input="fiatToCrypto"
        ></v-text-field>
        <v-select
          style="max-width: 130px"
          class="rounded-right no-left-border"
          v-model="form.fiatSelected"
          :items="filteredFiatItems"
          :disabled="loading.data"
          :menu-props="{ closeOnContentClick: true }"
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
              ref="fiatForm"
              variant="outlined"
              class="px-2"
              prepend-inner-icon="mdi-magnify"
              density="compact"
              placeholder="Search"
              :autofocus="true"
              :error-messages="form.fiatAmountError"
              @update:model-value="updateFiatFilter"
              @click.stop="(e) => e.preventDefault()"
            >
            </v-text-field>
          </template>
          <template #item="data">
            <div
              class="d-flex align-center justify-space-between full-width cursor-pointer"
              @click="selectCurrency(data.item.value)"
            >
              <div class="d-flex align-center">
                <div class="currency-container padding--2 mr-1 ml-3">
                  <img
                    :src="getIcon(data.item.value)"
                    :alt="data.item.value"
                    width="30px"
                    height="30px"
                  />
                </div>
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
        <div class="mew-heading-4 mr-2">
          What wallet are you sending your crypto from?
        </div>
      </div>
      <mew-address-select
        ref="addressSelect"
        :model-value="form.address"
        :error-messages="form.addressErrorMsg"
        :autofocus="false"
        label=""
        :is-valid-address="form.validAddress"
        placeholder="Enter Crypto Address"
        :network="selectedNetwork"
        @keyup="verifyAddress"
        @changed="addressInput"
      />
    </div>

    <div class="text-gray mt-3 mb-6">
      After submitting your sell order, you will have to send your crypto to
      MoonPay. Make sure to have enough currency in your wallet to cover network
      transaction fees.
      <br />
      <br />
      <div v-if="form.fees" class="text-bolder">
        <span class="text-gray">Fees:</span>
        <span class="text-gray" style="float: right">{{
          formattedFiatFee
        }}</span>
      </div>
      <div
        v-if="form.quoteError"
        class="text-bolder text-error mew-heading-4 text-center"
      >
        <span class="text-gray">{{ form.quoteError }}</span>
      </div>
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
          class="sell-button"
        >
          <div class="text-white font-weight-bold">Sell With Moonpay</div>
        </v-btn>
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
  ref,
  Ref,
  inject,
  defineProps,
  defineEmits,
} from "vue";
import { currencySymbols } from "./handler/prices";
import { debounce, isNumber, isObject } from "lodash";
import { sha3 } from "web3-utils";
import MewAddressSelect from "../MewAddressSelect/MewAddressSelect.vue";
import { Network } from "./network/types";

import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/plugins/globalStore";
import addressValidator from "@/helpers/addressValidator";
import api from "./handler/api";
import BigNumber from "bignumber.js";

const amplitude: any = inject("$amplitude");

const props = defineProps({
  heldAddress: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["addressInput"]);

const store = useGlobalStore();
const { setSelectedCrypto } = store;
const {
  selectedFiat,
  selectedCrypto,
  selectedNetwork,
  sellFiats,
  sellNetworks,
  cgPrice,
} = storeToRefs(store);

const { setSelectedNetwork, toggleTokenModal, setSelectedFiat } = store;

const defaultFiatValue = "300";
const rules = [
  (e: any) => {
    if (!isNumber(Number(e))) return "Must be a valid number";
    if (BigNumber(e).lte(0)) return "Must be greater than 0";
    if (BigNumber(e).isNaN()) return "Must be a valid number";
    return true;
  },
];
const fiatRules = [
  (e: any) => {
    if (!isNumber(Number(e))) return "Must be a valid number";
    if (BigNumber(e).lte(0)) return "Must be greater than 0";
    if (BigNumber(e).isNaN()) return "Must be a valid number";
    if (BigNumber(e).gt(max.value))
      return `Maximum amount is ${max.value} ${selectedFiat.value.name}`;
    if (BigNumber(e).lt(min.value))
      return `Minimum amount is ${min.value} ${selectedFiat.value.name}`;
    return true;
  },
];

// reactive
const fiatFilter = ref("");
const fiatItems: Ref<string[]> = ref(Array.from(sellFiats.value.keys()));
const filteredFiatItems: Ref<string[]> = ref(
  Array.from(sellFiats.value.keys())
);
const updateFiatFilter = (filter: string) => {
  fiatFilter.value = filter;
  if (filter) {
    filteredFiatItems.value = fiatItems.value.filter((item) =>
      item.toLowerCase().includes(fiatFilter.value.toLowerCase())
    );
  } else {
    filteredFiatItems.value = fiatItems.value;
  }
};

const fiatForm = ref(null);

// reactive
const form = reactive({
  fiatAmount: defaultFiatValue,
  fiatSelected: "USD",
  cryptoAmount: "1",
  cryptoSelected: "ETH",
  address: "",
  validAddress: false,
  addressErrorMsg: "",
  addressError: false,
  fees: "",
  quoteError: "",
  balance: "",
  balanceWei: "",
  balanceETH: "",
  balanceError: false,
  balanceErrorMsg: "",
  url: "",
  fiatAmountError: "",
});
const loading = reactive({
  data: false,
  showAlert: false,
  processingBuyForm: false,
  alertMessage: "",
});

const addressSelect = ref(null);

onMounted(async () => {
  form.address = "";

  if (addressSelect.value) {
    addressSelect.value.locAddress = props.heldAddress;
    addressSelect.value.onInputChange(props.heldAddress);
  }

  // check if current selected network is supported in sell networks
  const network = sellNetworks.value.find(
    (n: Network) => n.name === selectedNetwork.value.name
  );

  if (!network) {
    setSelectedNetwork(sellNetworks.value[0]);
  } else {
    setSelectedNetwork(network);
  }

  // check if current selected fiat is supported in sell fiats
  const fiat = sellFiats.value.get(selectedFiat.value.name);
  const crypto = selectedNetwork.value.tokens.find(
    (token) => token.symbol === selectedCrypto.value.symbol
  );

  if (!crypto) {
    form.cryptoSelected = selectedCrypto.value.symbol;
    setSelectedCrypto(selectedNetwork.value.tokens[0]);
  } else {
    form.cryptoSelected = crypto.symbol;
  }

  if (!fiat) {
    const locFiat = sellFiats.value.get("USD");
    setSelectedFiat(
      locFiat
        ? {
            name: locFiat.fiat_currency,
            value: locFiat.fiat_currency,
            img: locFiat.img,
          }
        : {
            name: "USD",
            value: "USD",
            img: require("@/assets/images/fiat/USD.svg"),
          }
    );
    form.fiatSelected = "USD";
  } else {
    form.fiatSelected = selectedFiat.value.name;
  }
  quoteFetch(form.address).then(() => fiatToCrypto(true));
});

// computed
const validFiatAmount = computed(() => {
  if (!isNumber(Number(form.fiatAmount))) return false;
  if (BigNumber(form.fiatAmount).lte(0)) return false;
  if (BigNumber(form.fiatAmount).isNaN()) return false;
  if (BigNumber(form.fiatAmount).gt(max.value)) return false;
  if (BigNumber(form.fiatAmount).lt(min.value)) return false;
  return true;
});

const validCryptoAmount = computed(() => {
  if (!isNumber(Number(form.cryptoAmount))) return false;
  if (BigNumber(form.cryptoAmount).lte(0)) return false;
  if (BigNumber(form.cryptoAmount).isNaN()) return false;
  return true;
});
const formattedFiatFee = computed(() => {
  const amount = form.fees;
  const symbol = currencySymbols[selectedFiat.value.name]
    ? currencySymbols[selectedFiat.value.name]
    : "";
  return `${symbol}${amount} ${selectedFiat.value.name}`;
});

const isValidForm = computed(() => {
  return (
    form.fiatSelected &&
    form.cryptoSelected &&
    form.address &&
    !form.addressError &&
    form.addressErrorMsg === "" &&
    form.quoteError === "" &&
    loading.alertMessage === "" &&
    form.validAddress &&
    !loading.data &&
    validFiatAmount.value &&
    validCryptoAmount.value
  );
});

const cryptoPrice = computed(() => {
  if (selectedCrypto.value.price) return selectedCrypto.value.price;
  const foundToken = selectedNetwork.value.tokens.find((token) => {
    if (token.symbol === selectedCrypto.value.symbol) {
      return token;
    }
  });
  if (!foundToken) return 100;
  if (foundToken.price) return foundToken.price;
  if (foundToken.cgId) {
    const price = cgPrice.value.get(foundToken.cgId);
    if (price) return price;
  }
  return 100;
});

const min = computed(() => {
  const fiat = sellFiats.value.get(selectedFiat.value.name);
  return fiat ? fiat.limits.min : 50;
});

const max = computed(() => {
  const fiat = sellFiats.value.get(selectedFiat.value.name);
  return fiat ? fiat.limits.max : 20000;
});

// watchers
watch(
  () => selectedFiat.value,
  () => {
    if (fiatForm.value) {
      fiatForm?.value.validate().then(() => {
        cryptoToAmount();
      });
    }
  },
  { deep: true }
);
watch(
  () => form.address,
  (formAddress) => {
    form.validAddress = false;
    form.addressError = false;
    form.addressErrorMsg = "";
    if (formAddress) {
      verifyAddress();
      quoteFetch(form.address);
    }
  },
  { deep: true }
);

// methods
const fiatToCrypto = debounce((onlyGenerate = false) => {
  if (form.fiatAmount && isNumber(Number(form.fiatAmount))) {
    form.cryptoAmount = BigNumber(form.fiatAmount)
      .div(cryptoPrice.value)
      .toString();
    const generated = isObject(onlyGenerate) ? false : onlyGenerate;
    if (form.cryptoAmount && !generated) {
      quoteFetch(form.address, generated);
    }
  }
}, 500);
const cryptoToAmount = debounce(() => {
  if (form.cryptoAmount && isNumber(Number(form.cryptoAmount))) {
    form.fiatAmount = BigNumber(form.cryptoAmount)
      .times(cryptoPrice.value)
      .toString();
    if (form.fiatAmount) {
      quoteFetch(form.address, true);
    }
  }
}, 500);

const verifyAddress = () => {
  const valid = addressValidator(form.address, form.cryptoSelected);
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

const openTokenSelect = () => {
  toggleTokenModal();
};

const quoteFetch = async (
  address: string,
  fromCrypto = false
): Promise<void> => {
  form.quoteError = "";
  const defaultAddress: { [key: string]: string } = {
    ADA: "addr1vx7j284mqe59w2mka36gf5xq0hvu8ms2989553fk5qh3prcapfpj3",
    ALGO: "4H5UNRBJ2Q6JENAXQ6HNTGKLKINP4J4VTQBEPK5F3I6RDICMZBPGNH6KD4",
    ARB: "0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D",
    ATOM: "cosmos10taaryv2hhjwxlztes38sqxfce6q090a2m2sss",
    BASE: "0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D",
    BCH: "bitcoincash:qzrzqwm4tllqevxplgcz4qdcrt837r7wyg0k5l2gwq",
    BSC: "0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D",
    BTC: "1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9",
    DOGE: "DCGqu6EtF5m83NYgSWPQiGM3mDuxn8Hgtm",
    ETH: "0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D",
    LTC: "LcNS6c8RddAMjewDrUAAi8BzecKoosnkN3",
    OP: "0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D",
    POL: "0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D",
    SOL: "7ngWv14ECRwq8QNQJCaYGCL7wppJYrh4UUgSTCZQeaca",
    XLM: "GCJ2RDQLOVNOYBD2LELEGEVIDZ3LRLPHGANVOFJZXTUQHKHVZX2LMRFB",
  };
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const platform = urlParams.get("platform") || "web";
  const userAddress = address
    ? address
    : defaultAddress[selectedNetwork.value.name]; // mew donation to enable fetch before user adds address
  const data = await fetch(
    `${api.endpoint}/v5/purchase/sell?id=${sha3(userAddress)?.substring(
      0,
      42
    )}&address=${userAddress}&fiatCurrency=${selectedFiat.value.name}&amount=${
      form.cryptoAmount
    }&cryptoCurrency=${selectedCrypto.value.symbol}&chain=${
      selectedNetwork.value.name
    }&platform=${platform}`
  );
  const quote = await data.json();
  const { msg, errors, error } = quote;
  if (msg || error) {
    let message = "";
    if (errors) {
      errors.forEach((error: any) => {
        message += `${error} `;
      });

      form.quoteError = `${msg}. ${message}`;
      return;
    }
    form.quoteError = msg;
    return;
  }
  form.fees = quote[0].fiat_fees;
  if (address) form.url = quote[0].url; // only set url if address is provided
};

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

const addressInput = (value: string, isResolved: string): void => {
  form.address = value;
  emit("addressInput", isResolved ? isResolved : value);
  verifyAddress();
};

const submitForm = async (): Promise<void> => {
  loading.processingBuyForm = true;
  amplitude.track("CCBuySellSellWithMoonpay");
  window.open(form.url, "_blank");
  loading.processingBuyForm = false;
};
</script>

<style lang="scss" scoped>
.sell-button {
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-btn-linear-1)) 0%,
    rgba(var(--v-theme-btn-linear-2)) 100%
  );
}
</style>

<style lang="scss">
.components--sell-form {
  .v-field__outline__end,
  .v-field__outline__notch::after,
  .v-field__outline__start {
    border-color: #c2c2c2 !important;
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

.currency-container {
  border-radius: 50%;
  border: 2px solid silver;
  width: 25px;
  height: 25px;
  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    top: -5px;
    right: -5px;
  }
}

.error {
  color: rgb(var(--v-theme-error)) !important;
}
</style>
