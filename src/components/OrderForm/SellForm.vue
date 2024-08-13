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
          Balance: {{ displayBalance() }}
        </div>
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
          :disabled="loading.data"
          :error-messages="form.balanceErrorMsg"
          :error="form.balanceError"
          class="no-right-border"
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
          class="no-right-border"
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
              density="compact"
              placeholder="Search"
              :autofocus="true"
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
                  class="currency-icon padding--2 mr-1 ml-3"
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
        :network="props.networkSelected"
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
      <div class="text-bolder">
        <span class="text-gray">Network Fee:</span>
        <span class="text-gray" style="float: right"
          >~{{ networkFeeF }} {{ props.networkSelected.currencyName }}</span
        >
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
  inject,
} from "vue";
import BigNumber from "bignumber.js";
import { supportedFiat, getCryptoSellPrices } from "./handler/prices";
import { executeMoonpaySell } from "./handler/order";
import { isObject, isNumber, isString, isEmpty } from "lodash";
import WAValidator from "multicoin-address-validator";
import { isHexStrict, isAddress, fromWei, toBN } from "web3-utils";
import { encodeAddress } from "@polkadot/keyring";
import MewAddressSelect from "../MewAddressSelect/MewAddressSelect.vue";
import { Networks } from "./network/networks";
import { Crypto, Data, Network, Fiat } from "./network/types";
import Web3 from "web3";
import { formatFloatingPointValue } from "@/helpers/numberFormatHelper";
import { abi } from "./handler/abiERC20";
import { fromBase, toBase } from "@/helpers/units";
import { PriceItem } from "./types";

const amplitude: any = inject("$amplitude");

const defaultFiatValue = "0";
const polkdadot_chains = ["DOT", "KSM"];
let gasPrice = ref("0");
// eslint-disable-next-line no-undef
let priceTimer: NodeJS.Timer, gasTimer: NodeJS.Timer;
let fiatFilter = "";
// Hard code names/decimals for now
const tokensInfo: { [key: string]: any } = {
  USDT: {
    name: "USDT",
    decimals: 6,
    contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
  USDC: {
    name: "USDC",
    decimals: 6,
    contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  DAI: {
    name: "DAI",
    decimals: 18,
    contract: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
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

const emit = defineEmits([
  "success",
  "selectedCurrency",
  "selectedFiat",
  "toAddress",
  "setQuotes",
]);

const props = defineProps({
  cryptoSelected: {
    type: Object as PropType<Crypto>,
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

onMounted(async () => {
  form.address = "";

  // Load URL parameter value and verify crypto address
  setup();
});

onUnmounted(async () => {
  clearInterval(priceTimer);
  clearInterval(gasTimer);
});

// reactive
const fiatItems: string[] = supportedFiat;
const filteredFiatItems: Ref<string[]> = ref(fiatItems);
const updateFiatFilter = (value: string) => {
  fiatFilter = value;
  const items = Object.getOwnPropertyNames(moonpayData["ETH"]?.prices);
  filteredFiatItems.value = items.filter((item) =>
    item.toLowerCase().includes(fiatFilter.toLowerCase())
  );
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
  balance: "",
  balanceWei: "",
  balanceETH: "",
  balanceError: false,
  balanceErrorMsg: "",
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

const web3 = computed(() => {
  const supportedNodes: { [key: string]: any } = {
    ETH: "ETH",
    BSC: "BSC",
    MATIC: "MATIC",
  };
  const nodeType = supportedNodes[props.cryptoSelected.network];
  const node = Networks.find((network) => {
    return network.name === nodeType;
  });
  return new Web3(node ? node.url : "");
});

// watchers
watch(
  () => form.cryptoSelected,
  () => {
    verifyAddress();
    fiatToCrypto();
    fetchGasPrice();
    checkBalance();
  }
);

watch(
  () => form.fiatSelected,
  () => {
    const inList = filteredFiatItems.value.findIndex(
      (item) => item === form.fiatSelected
    );
    if (inList < 0) form.fiatSelected = "USD";
    verifyAddress();
    cryptoToFiat();
  }
);

watch(
  () => form.fiatAmount,
  () => {
    fetchGasPrice();
    if (!loading.data) {
      checkBalance();
    }
  }
);
watch(
  () => form.cryptoAmount,
  () => {
    fetchGasPrice();
    if (!loading.data) {
      checkBalance();
    }
  }
);

watch(
  () => form.address,
  () => {
    verifyAddress();
    fetchGasPrice();
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
  return require(`@/assets/images/crypto/${props.cryptoSelected.symbol}.svg`);
});

const networkFee = computed(() => {
  return toBN(gasPrice.value).muln(21000);
});
const networkFeeF = computed(() => {
  return formatFloatingPointValue(fromWei(networkFee.value.toString())).value;
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
};

const hasData = () => {
  const { cryptoSelected } = form;
  return !isEmpty(moonpayData[cryptoSelected]?.limits[cryptoSelected]);
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
    form.validAddress &&
    form.balanceErrorMsg === ""
  );
});

const rules = [
  (e: any) => {
    if (isString(e) && e?.length >= 1) return true;
    if (!isNumber(e)) return "Must be a valid number";
    return true;
  },
];

const minMax = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cryptoSelected, cryptoAmount, address } = form; // wont update without address
  const validData = hasData();
  if (!validData) return false;
  const limit = moonpayData[cryptoSelected].limits[cryptoSelected];
  const decimals = props.cryptoSelected.decimals;
  const parsedAmount = BigNumber(cryptoAmount).isNaN() ? "0" : cryptoAmount;
  const amount = toBN(toBase(parseFloat(parsedAmount), decimals));
  const valid =
    amount.gte(toBN(toBase(limit.min, decimals))) &&
    amount.lte(toBN(toBase(limit.max, decimals)));
  return valid;
});

const getPrices = async () => {
  try {
    loading.data = true;
    const data: any[] = (await getCryptoSellPrices()) || [];
    data.forEach((arr: any) => {
      arr.forEach((d: PriceItem) => {
        if (isObject(d)) {
          const tmp: Data = { conversion_rates: {}, limits: {}, prices: {} };

          d.conversion_rates.forEach(
            (r: any) =>
              (tmp.conversion_rates[r.fiat_currency] = r.exchange_rate)
          );
          d.limits.forEach((l: any) => {
            if (l.type === "WEB") tmp.limits[l.crypto_currency] = l.limit;
          });
          d.prices.forEach((p: any) => (tmp.prices[p.fiat_currency] = p.price));
          const tokenName = d.crypto_currencies[0];
          // const mainCoin = Networks.find(
          //   (item) => item.currencyName === tokenName
          // );
          // If token name isnt a native network coin
          // assume the token is ERC-20(ETH)
          // if (!mainCoin) {
          //   const foundToken = Networks[0].tokens.find(
          //     (item) => item.name === tokenName
          //   );
          //   if (!foundToken) {
          //     const tokenInfo = tokensInfo[tokenName];
          //     Networks[0].tokens.push(
          //       new Crypto(
          //         tokenName,
          //         tokenInfo.name,
          //         "ETH",
          //         tokenInfo.decimals,
          //         getIcon(tokenName, false)
          //       )
          //     );
          //   }
          // }
          moonpayData[tokenName] = tmp;
        }
      });
    });
    loading.data = false;
    emit("setQuotes", moonpayData);
  } catch (e: any) {
    errorHandler(e);
  }
};

const getBalance = async () => {
  if (!form.validAddress) return "0";
  const isMainCoin =
    props.networkSelected.currencyName === props.cryptoSelected.symbol;
  const balance = form.address ? await getETHBalance() : "0";
  if (isMainCoin) {
    form.balanceWei = balance;
    form.balance = fromWei(balance);
  } else await getTokenBalance(props.cryptoSelected.symbol);

  checkBalance();
  return balance;
};
const getETHBalance = async () => {
  if (!form.validAddress) return "0";
  const balance = form.address
    ? await web3.value.eth.getBalance(form.address, "latest")
    : "0";
  form.balanceETH = balance;
  return balance;
};

const displayBalance = () => {
  if (!form.balance) return "0";

  return formatFloatingPointValue(form.balance).value;
};
const userBalance = () => {
  if (!form.balanceWei) return toBN(0);

  return toBN(form.balanceWei);
};

const hasEnoughCrypto = () => {
  if (!form.balanceWei || form.balanceWei === "0") return false;
  const isMainCoin =
    props.networkSelected.currencyName === props.cryptoSelected.symbol;
  return isMainCoin
    ? totalWithFee.value.lte(toBN(form.balanceETH))
    : networkFee.value.lte(toBN(form.balanceETH));
};

const totalWithFee = computed(() => {
  if (subtotalSell.value === toBN(0)) return networkFee.value;
  return subtotalSell.value.add(networkFee.value);
});
const subtotalSell = computed(() => {
  if (!form.balance || form.balance === "0") return toBN(0);
  const amount = toBase(
    parseFloat(form.cryptoAmount),
    props.cryptoSelected.decimals
  );
  return toBN(amount);
});

const checkBalance = () => {
  const validData = hasData();
  if (validData) {
    // MinMax check
    const limit = moonpayData[form.cryptoSelected].limits[form.cryptoSelected];
    if (!minMax.value) {
      const decimals = props.cryptoSelected.decimals;
      const amount = toBN(
        toBase(
          parseFloat(
            BigNumber(form.cryptoAmount).isNaN() ? "0" : form.cryptoAmount
          ),
          decimals
        )
      );
      const min = toBN(toBase(limit.min, decimals));
      const max = toBN(toBase(limit.max, decimals));
      if (amount.lt(min))
        form.balanceErrorMsg = `Minimum is ${limit.min} ${form.cryptoSelected}`;
      else if (amount.gt(max))
        form.balanceErrorMsg = `Maximum is ${limit.max} ${form.cryptoSelected}`;
      form.balanceError = true;
      return;
    }
  }

  // User balance check
  if (form.validAddress) {
    const balance = userBalance();
    if (subtotalSell.value.gt(balance)) {
      form.balanceErrorMsg = `You do not have enough ${props.cryptoSelected.name} to sell`;
      return;
    }
    if (!hasEnoughCrypto()) {
      form.balanceErrorMsg = `You do not have enough ${props.networkSelected.currencyName} to pay for network fees`;
      return;
    }
  }
  form.balanceErrorMsg = "";
  form.balanceError = false;
};

const fiatToCrypto = () => {
  const { fiatSelected, fiatAmount } = form;
  const decimals = props.cryptoSelected.decimals;
  const price = parseFloat(
    moonpayData[props.cryptoSelected.symbol].prices[fiatSelected]
  );
  const amount = parseFloat(fiatAmount || "0");
  const cryptoAmount = amount / price;
  // Make sure decimal amount is valid
  const decimalAmount = cryptoAmount.toString().split(".")[1]?.length || 0;
  form.cryptoAmount =
    decimalAmount > decimals
      ? cryptoAmount.toFixed(decimals)
      : cryptoAmount.toString();
};

const cryptoToFiat = () => {
  const price = parseFloat(
    moonpayData[form.cryptoSelected].prices[form.fiatSelected]
  );
  const amount = parseFloat(form.cryptoAmount || "0");
  const fiatAmount = amount * price;
  form.fiatAmount = fiatAmount.toFixed(2);
};

const loadUrlParameters = () => {
  const queryString = window.location.search;
  if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    const queryCryptoAmount = urlParams.get("crypto_amount");
    const queryFiat = urlParams.get("fiat");
    const queryCrypto = urlParams.get("crypto");
    const queryTo = urlParams.get("to");
    form.fiatSelected = queryFiat ? queryFiat : "USD";
    form.fiatAmount = queryCryptoAmount ? queryCryptoAmount : "100";
    form.cryptoSelected = queryCrypto ? queryCrypto : "ETH";
    form.cryptoAmount = queryCryptoAmount ? queryCryptoAmount : "1";
    form.address = queryTo ? queryTo : "";
  }
};

const errorHandler = (e: any): void => {
  const value = parseFloat(form.fiatAmount) > 0;
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
  const polkdadot_chains = ["DOT", "KSM"];
  const valid = !polkdadot_chains.includes(form.cryptoSelected)
    ? WAValidator.validate(form.address, form.cryptoSelected) &&
      validAddress(form.address)
    : isValidAddressPolkadotAddress(
        form.address,
        form.cryptoSelected === "DOT" ? 0 : 2
      );
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

const submitForm = async (): Promise<void> => {
  loading.processingBuyForm = true;
  amplitude.track("CCBuySellSellWithMoonpay");
  executeMoonpaySell(form.cryptoSelected, form.cryptoAmount, form.address).then(
    (res) => {
      if (res) {
        window.open(res, "_blank");
        reset();
      }
    }
  );
};

const reset = () => {
  form.fiatAmount = defaultFiatValue;
  form.cryptoAmount = "1";
  form.address = "";
  form.validAddress = false;
  form.addressErrorMsg = "";
  form.addressError = false;
  form.balance = "";
  form.balanceWei = "";
  form.balanceETH = "";
  form.balanceError = false;
  form.balanceErrorMsg = "";
  loading.processingBuyForm = false;
  loading.alertMessage = "";
  setup();
};

const setup = async () => {
  loadUrlParameters();
  verifyAddress();

  // Get crypto Data
  await getPrices();
  await fetchGasPrice();
  if (!isEmpty(props.fiatSelected)) {
    form.cryptoSelected = props.cryptoSelected.symbol;
    form.fiatSelected = props.fiatSelected.name;
    form.fiatAmount = props.fiatAmount;
    fiatToCrypto();
  } else cryptoToFiat();
  getBalance();
  priceTimer = setInterval(getPrices, 1000 * 60 * 2);
  gasTimer = setInterval(fetchGasPrice, 1000 * 60 * 2);
  filteredFiatItems.value = Object.getOwnPropertyNames(
    moonpayData["ETH"]?.prices
  );
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

const fetchGasPrice = async (): Promise<void> => {
  if (polkdadot_chains.includes(form.cryptoSelected)) {
    gasPrice.value = "0";
    return;
  }
  gasPrice.value = await web3.value.eth.getGasPrice();
};

const getTokenBalance = async (tokenName: string) => {
  // if (!isValidAddress(contract)) return;
  const newContract = new web3.value.eth.Contract(
    abi as any,
    tokensInfo[tokenName].contract
  );
  const bal = await newContract.methods
    .balanceOf(form.address)
    .call()
    .catch((e: Error) => console.error(e));
  form.balanceWei = bal.toString();
  form.balance = fromBase(form.balanceWei, tokensInfo[tokenName].decimals);
};

const concatenate = (value: string) => {
  return value.length > 3 ? `${value.slice(0, 3)}...` : value;
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
</style>
