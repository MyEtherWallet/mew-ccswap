<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <div>
    <div class="d-flex align-center textDark--text mb-10">
      <v-icon color="textDark" class="cursor-pointer" @click="close">
        mdi-arrow-left mr-4
      </v-icon>
      <div class="mew-heading-2">Select Token</div>
    </div>

    <div>
      <!-- ============================================================== -->
      <!-- Network Selection -->
      <!-- ============================================================== -->
      <div class="d-flex mt-2">
        <v-select
          class="full-width"
          v-model="networkSelected"
          label="Network"
          :items="filteredNetworkList"
          :menu-props="{ closeOnContentClick: true }"
          return-object
          variant="outlined"
        >
          <template #selection>
            <img
              class="network-icon mr-5 pa-1"
              :src="networkSelected.icon"
              :alt="networkSelected.name"
              width="28px"
              height="28px"
            />
            <span class="network-selected">
              {{ networkSelected.name_long }}
            </span>
          </template>
          <template #prepend-item>
            <div class="px-8 pt-6">
              <div class="mew-heading-4 mb-4">Select Network</div>
              <v-text-field
                v-model="networkSearchInput"
                variant="outlined"
                class="mr-1"
                prepend-inner-icon="mdi-magnify"
                placeholder="Search"
                :autofocus="true"
              ></v-text-field>
            </div>
          </template>
          <template #item="data">
            <div
              class="d-flex align-center justify-space-between full-width cursor-pointer px-8 pb-6"
              @click="selectNetwork(data.item.value)"
            >
              <div class="d-flex align-center">
                <img
                  class="currency-icon padding--2 mr-1 ml-3"
                  :src="data.item.value.icon"
                  :alt="data.item.value.name"
                  width="25px"
                  height="25px"
                />
                <span class="ml-2 my-2 d-flex flex-column">{{
                  data.item.value.name_long
                }}</span>
              </div>
            </div>
          </template>
        </v-select>
      </div>

      <!-- ============================================================== -->
      <!-- Token Selection Search -->
      <!-- ============================================================== -->
      <div class="d-flex">
        <v-text-field
          v-model="searchInput"
          variant="outlined"
          class="mr-1"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search"
          :autofocus="true"
        ></v-text-field>
      </div>

      <!-- ============================================================== -->
      <!-- Token Selection List -->
      <!-- ============================================================== -->
      <div class="d-flex token-container-overflow">
        <v-list lines="one" class="full-width">
          <v-list-item
            v-for="(item, i) in filteredTokenList"
            :key="i"
            :value="item"
            base-color="primary"
            @click="selectCurrency(item, true)"
          >
            <template #prepend>
              <img
                class="currency-icon no-border mr-3"
                :src="item.img"
                :alt="item.name"
                width="25px"
                height="25px"
              />
            </template>
            <v-list-item-title>
              <div>
                <span class="text-capitalize text--bold">
                  {{ item.symbol }}
                </span>
                <span>
                  {{ ` - ${item.subtext ? item.subtext : item.name}` }}
                </span>
              </div>
            </v-list-item-title>
            <template #append>
              <span>{{ tokenPrice(item.symbol) }}</span>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  ref,
  Ref,
  computed,
  onBeforeMount,
  defineEmits,
  watch,
  PropType,
} from "vue";
import { Crypto, Network, Data, Fiat } from "../types";
import { Networks } from "../network/networks";
import { formatFiatValue } from "@/helpers/numberFormatHelper";

// emit
const emit = defineEmits(["selectedNetwork", "selectCurrency", "close"]);

// props
const props = defineProps({
  close: {
    type: Function,
    default: () => ({}),
  },
  selectedNetwork: {
    type: Object as PropType<Network>,
    default: () => ({}),
  },
  selectedCurrency: {
    type: Object as PropType<Crypto>,
    default: () => ({}),
  },
  moonpayData: {
    type: Object as PropType<{ [key: string]: Data }>,
    default: () => ({}),
  },
  topperData: {
    type: Object as PropType<{ [key: string]: Data }>,
    default: () => ({}),
  },
  simplexData: {
    type: Object as PropType<{ [key: string]: Data }>,
    default: () => ({}),
  },
  fiatSelected: {
    type: Object as PropType<Fiat>,
    default: () => ({}),
  },
  isSell: {
    type: Boolean,
    default: false,
  },
});

// reactive data
const networks: Network[] = Networks;
const networkSelected: Ref<Network> = ref<Network>({
  name: "",
  name_long: "",
  chainID: 0,
  tokens: [],
  icon: "",
  currencyName: "",
  gasPriceMultiplier: 0,
  coingeckoID: "",
  service: "",
  url: "",
  port: 443,
  auth: false,
  username: "",
  password: "",
});
const cryptoSelected: Ref<Crypto> = ref<Crypto>({
  decimals: 18,
  img: "",
  name: "",
  subtext: "",
  value: "",
  symbol: "",
  network: "",
});

const networkDropdown: Ref<boolean> = ref(false);
const cryptoDropdown: Ref<boolean> = ref(false);
const searchInput: Ref<string> = ref("");
const networkSearchInput: Ref<string> = ref("");

// computed

const tokensList = computed<Crypto[]>(() => {
  let decimals = 18;
  if (networkSelected.value.name === "DOT") decimals = 10;
  else if (networkSelected.value.name === "KSM") decimals = 12;
  const mainCoin = new Crypto(
    networkSelected.value.currencyName,
    networkSelected.value.name_long,
    networkSelected.value.name,
    decimals,
    networkSelected.value.icon
  );
  let tokensList = [mainCoin];
  if (fiatName.value === "CAD") return tokensList;
  if (networkSelected.value.tokens.length > 0)
    return tokensList.concat(networkSelected.value.tokens);
  return tokensList;
});

const filteredTokenList = computed<Crypto[]>(() => {
  const filterText = searchInput.value.toLowerCase();
  const tokens = tokensList.value.filter((token) => {
    const tokenSymbol = token.name.toLowerCase();
    const tokenName = token.subtext.toLowerCase();
    if (
      hasValidPrices(token.symbol) &&
      (tokenSymbol.includes(filterText) || tokenName.includes(filterText))
    )
      return token;
  });
  return tokens;
});

const fiatName = computed<string>(() => {
  return props.fiatSelected.name;
});

const networkList = computed<Network[]>(() => {
  return props.isSell
    ? networks.filter((network) => {
        if (network.name === "ETH") return network;
      })
    : networks;
});

const filteredNetworkList = computed<Network[]>(() => {
  const withTokensNetwork = networkList.value
    .filter((network) => {
      if (network.tokens.length > 0) return network;
    })
    .filter((network) => {
      if (hasValidPrices(network.name)) return network;
    });
  const filter = networkSearchInput.value.toLowerCase();
  return withTokensNetwork.filter((network) => {
    if (
      network.name.toLowerCase().includes(filter) ||
      network.name_long.toLowerCase().includes(filter) ||
      network.currencyName.toLowerCase().includes(filter)
    )
      return network;
  });
});

// beforeMount
onBeforeMount(() => {
  networkSelected.value = props.selectedNetwork;
  cryptoSelected.value = props.selectedCurrency;
});

// watch
watch(
  () => networkSelected,
  () => {
    selectCurrency(tokensList.value[0]);
    emit("selectedNetwork", networkSelected.value);
  }
);

// methods
const selectCurrency = (currency: Crypto, shouldEmit = false) => {
  cryptoSelected.value = currency;
  cryptoDropdown.value = false;
  if (shouldEmit) emit("selectCurrency", cryptoSelected.value);
};

const selectNetwork = (network: Network) => {
  networkSelected.value = network;
  networkDropdown.value = false;
};

const tokenPrice = (token: string) => {
  const simplexPrice = parseFloat(
    props.simplexData[token]?.prices[fiatName.value]
  );
  const moonpayPrice = parseFloat(
    props.moonpayData[token]?.prices[fiatName.value]
  );
  const topperPrice = parseFloat(
    props.topperData[token]?.prices[fiatName.value]
  );
  const currencyConfig = {
    locale: "en-US",
    rate: 1,
    currency: fiatName.value,
  };
  if (isNaN(moonpayPrice) && isNaN(topperPrice))
    return formatFiatValue(simplexPrice.toFixed(2), currencyConfig).value;
  if (isNaN(simplexPrice) && isNaN(topperPrice))
    return formatFiatValue(moonpayPrice.toFixed(2), currencyConfig).value;
  if (isNaN(simplexPrice) && isNaN(moonpayPrice))
    return formatFiatValue(topperPrice.toFixed(2), currencyConfig).value;
  const price =
    simplexPrice <= moonpayPrice
      ? simplexPrice
      : moonpayPrice <= topperPrice
      ? moonpayPrice
      : topperPrice;
  return formatFiatValue(price.toFixed(2), currencyConfig).value;
};

const hasValidPrices = (token: string) => {
  let price = tokenPrice(token);
  price = price?.substring(1, price.length);
  if (props.fiatSelected.name === "JPY") return price !== "0";
  return price !== "0.00";
};

const close = () => {
  emit("close");
};
</script>

<style lang="scss" scoped>
// Variables
$greyLight-base: #f2f3f6;
$greyPrimary-base: #5a678a;

.network-selected {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;

  color: #1f242f;

  flex: none;
  order: 1;
  flex-grow: 0;

  padding-top: 5px;
}
.text--bold {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;

  color: #1f242f;
}

.no-border {
  border: none;
}

.token-container-overflow {
  overflow-y: auto;
  max-height: 270px;
}
</style>
