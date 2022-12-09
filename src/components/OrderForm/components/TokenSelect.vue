<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <div>
    <div class="d-flex align-center textDark--text mb-10">
      <v-icon color="textDark" class="cursor-pointer" @click="$emit('close')">
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
      <div class="d-flex">
        <v-list lines="one" class="full-width">
          <v-list-item
            v-for="(item, i) in filteredTokenList"
            :key="i"
            :value="item"
            active-color="primary"
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
                  {{ item.name }}
                </span>
                <span>
                  {{ ` - ${item.subtext}` }}
                </span>
              </div>
            </v-list-item-title>
            <template #append>
              <span>{{ tokenPrice(item.name) }}</span>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Crypto, Network, Data, Fiat } from "../types";
import { Networks } from "../network/networks";
import { formatFiatValue } from "@/helpers/numberFormatHelper";

export default defineComponent({
  name: "TokenSelect",
  props: {
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
  },
  data() {
    return {
      networks: Networks,
      networkSelected: {} as Network,
      cryptoSelected: {} as Crypto,
      networkDropdown: false,
      cryptoDropdown: false,
      searchInput: "",
      networkSearchInput: "",
    };
  },
  computed: {
    cryptoIcon() {
      return require(`@/assets/images/crypto/${this.cryptoSelected.name}.svg`);
    },
    tokensList() {
      let decimals = 18;
      if (this.networkSelected.name === "DOT") decimals = 10;
      else if (this.networkSelected.name === "KSM") decimals = 12;
      const mainCoin = new Crypto(
        this.networkSelected.currencyName,
        this.networkSelected.name_long,
        this.networkSelected.name,
        decimals,
        this.networkSelected.icon
      );
      let tokensList = [mainCoin];
      if (this.networkSelected.tokens)
        tokensList = tokensList.concat(this.networkSelected.tokens);
      return tokensList;
    },
    filteredTokenList() {
      const filterText = this.searchInput.toLowerCase();
      return this.tokensList.filter((token) => {
        const tokenSymbol = token.name.toLowerCase();
        const tokenName = token.subtext.toLowerCase();
        if (
          this.hasValidPrices(token.name) &&
          (tokenSymbol.includes(filterText) || tokenName.includes(filterText))
        )
          return token;
      });
    },
    fiatName() {
      return this.fiatSelected.name;
    },
    networkList() {
      return this.isSell
        ? this.networks.filter(
            (network) => network.name !== "DOT" && network.name !== "KSM"
          )
        : this.networks;
    },
    filteredNetworkList() {
      const filter = this.networkSearchInput.toLowerCase();
      return this.networkList.filter(
        (network) =>
          network.name.toLowerCase().includes(filter) ||
          network.name_long.toLowerCase().includes(filter) ||
          network.currencyName.toLowerCase().includes(filter)
      );
    },
  },
  beforeMount() {
    this.networks = Networks;
    this.networkSelected = this.selectedNetwork;
    this.cryptoSelected = this.selectedCurrency;
  },
  watch: {
    networkSelected() {
      this.selectCurrency(this.tokensList[0]);
      this.$emit("selectedNetwork", this.networkSelected);
    },
  },
  methods: {
    selectCurrency(currency: Crypto, emit = false) {
      this.cryptoSelected = currency;
      this.cryptoDropdown = false;
      if (emit) this.$emit("selectCurrency", this.cryptoSelected);
    },
    selectNetwork(network: Network) {
      this.networkSelected = network;
      this.networkDropdown = false;
    },
    tokenPrice(token: string) {
      const simplexPrice = parseFloat(
        this.simplexData[token]?.prices[this.fiatName]
      );
      const moonpayPrice = parseFloat(
        this.moonpayData[token]?.prices[this.fiatName]
      );
      const currencyConfig = {
        locale: "en-US",
        rate: 1,
        currency: this.fiatName,
      };
      if (isNaN(moonpayPrice))
        return formatFiatValue(simplexPrice.toFixed(2), currencyConfig).value;
      if (isNaN(simplexPrice))
        return formatFiatValue(moonpayPrice.toFixed(2), currencyConfig).value;
      const price = simplexPrice <= moonpayPrice ? simplexPrice : moonpayPrice;
      return formatFiatValue(price.toFixed(2), currencyConfig).value;
    },
    hasValidPrices(token: string) {
      let price = this.tokenPrice(token);
      price = price?.substring(1, price.length);
      return price !== "0.00";
    },
  },
});
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
</style>
