<template>
  <div class="component--buy-form elevated-box pa-3 pa-sm-6 pa-md-8">
    <div class="top-container">
      <div v-if="step === 0">
        <MewTabs
          :items="tabItems"
          :active-tab="activeTab"
          active-color="greenPrimary"
          has-underline
          @onTab="onTab"
        >
          <template #tabContent1>
            <buy-form
              :crypto-selected="selectedCurrency"
              :fiat-selected="selectedFiat"
              :network-selected="selectedNetwork"
              :fiat-amount="fiatAmount"
              @setQuotes="setQuotes"
              @selectedCurrency="openTokenSelect"
              @success="buySuccess"
            />
          </template>
          <template #tabContent2>
            <sell-form
              :crypto-selected="selectedCurrency"
              :fiat-selected="selectedFiat"
              :network-selected="selectedNetwork"
              :fiat-amount="fiatAmount"
              @setQuotes="setQuotes"
              @selectedCurrency="openTokenSelect"
              @success="sellSuccess"
            />
          </template>
        </MewTabs>
      </div>
    </div>

    <div class="token-select-slider" :class="step === 1 ? 'open' : ''">
      <TokenSelect
        v-if="step === 1"
        class="pa-3 pa-sm-6 pa-md-8"
        :selected-network="selectedNetwork"
        :selected-currency="selectedCurrency"
        :fiat-selected="selectedFiat"
        :moonpay-data="moonpayData"
        :simplex-data="simplexData"
        :is-sell="isSell"
        @close="close"
        @selectCurrency="setSelectedCurrency"
        @selectedNetwork="setNetwork"
      />
    </div>

    <BuyProviders
      v-if="step === 2"
      :selected-fiat="selectedFiat"
      :selected-currency="selectedCurrency"
      :only-simplex="onlySimplex"
      :buy-obj="buyObj"
      :simplex-quote="simplexQuote"
      :to-address="toAddress"
      @close="close"
    />
  </div>
</template>

<script lang="ts">
import { isEmpty } from "lodash";

import MewTabs from "../MewTabs/MewTabs.vue";
import BuyForm from "./BuyForm.vue";
import BuyProviders from "./BuyProviders.vue";
import TokenSelect from "./components/TokenSelect.vue";
import SellForm from "./SellForm.vue";
import { defineComponent } from "vue";
import {
  Fiat,
  Crypto,
  QuoteData,
  SubmitData,
  SubmitSellData,
  Network,
  Data,
} from "./network/types";
import { Networks } from "./network/networks";

export default defineComponent({
  name: "OrderForm",
  components: {
    MewTabs,
    BuyForm,
    SellForm,
    BuyProviders,
    TokenSelect,
  },
  props: {
    // Removing breaks the page for some reason
    open: Boolean,
  },
  data() {
    return {
      activeTab: 0,
      orderHandler: {},
      selectedNetwork: {} as Network,
      selectedCurrency: {} as Crypto,
      selectedFiat: {} as Fiat,
      fiatAmount: "0",
      onlySimplex: false,
      buyObj: {} as QuoteData,
      step: 0,
      simplexQuote: {} as QuoteData,
      toAddress: "",
      moonpayData: {} as { [key: string]: Data },
      simplexData: {} as { [key: string]: Data },
    };
  },
  computed: {
    defaultCurrency(): Crypto {
      if (
        isEmpty(this.selectedCurrency) ||
        (this.activeTab === 1 && !this.supportedSell)
      ) {
        return {
          decimals: 18,
          img: require("@/assets/images/crypto/ETH.svg"),
          name: "ETH",
          subtext: "Ethereum",
          value: "ETH",
          symbol: "ETH",
          network: "ETH",
        };
      }
      return this.selectedCurrency;
    },
    defaultNetwork(): Network {
      if (
        isEmpty(this.selectedNetwork) ||
        (this.activeTab === 1 && !this.supportedSell)
      ) {
        return Networks[0];
      }
      return this.selectedNetwork;
    },
    supportedSell() {
      return (
        this.selectedCurrency.symbol !== "DOT" &&
        this.selectedCurrency.symbol !== "KSM"
      );
    },
    leftBtn() {
      return {
        method: this.close,
      };
    },
    tabItems() {
      return ["Buy", "Sell"];
    },
    isSell() {
      return this.activeTab === 1;
    },
  },
  beforeMount() {
    this.selectedNetwork = this.defaultNetwork;
    this.selectedCurrency = this.defaultCurrency;
  },
  methods: {
    onTab(val: number) {
      this.selectedCurrency = {} as Crypto;
      this.selectedCurrency = this.defaultCurrency;
      this.selectedNetwork = {} as Network;
      this.selectedNetwork = this.defaultNetwork;
      this.activeTab = val;
    },
    close() {
      this.step = 0;
      this.onlySimplex = false;
    },
    setNetwork(network: Network) {
      this.selectedNetwork = network;
    },
    setSelectedCurrency(e: Crypto) {
      this.selectedCurrency = e;
      this.step = 0;
    },
    setSelectedFiat(e: Fiat) {
      this.selectedFiat = e;
    },
    openProviders(val: number) {
      this.step = val;
    },
    openTokenSelect(selectedFiat: Fiat, fiatAmount: string) {
      this.step = 1;
      this.selectedFiat = selectedFiat;
      this.fiatAmount = fiatAmount;
    },
    setBuyObj(val: QuoteData) {
      this.buyObj = val;
    },
    setSimplexQuote(val: QuoteData) {
      this.simplexQuote = val;
    },
    setToAddress(val: string) {
      this.toAddress = val;
    },
    setQuotes(
      simplexQuote: { [key: string]: Data },
      moonpayQuote: { [key: string]: Data }
    ) {
      this.simplexData = simplexQuote;
      this.moonpayData = moonpayQuote;
    },
    reset() {
      this.selectedCurrency = this.defaultCurrency;
      this.selectedFiat = {
        name: "USD",
        value: "USD",
        // eslint-disable-next-line
        img: require(`@/assets/images/fiat/USD.svg`),
      };
      this.onlySimplex = false;
    },
    disableMoonpay(val: boolean) {
      this.onlySimplex = val;
    },
    buySuccess(data: SubmitData) {
      this.setSimplexQuote(data.simplex_quote);
      this.setToAddress(data.address);
      this.setBuyObj(data.buy_obj);
      this.setSelectedCurrency(data.selected_currency);
      this.openProviders(data.open_providers);
      this.setSelectedFiat(data.selected_fiat);
      this.fiatAmount = data.fiat_amount;
      this.disableMoonpay(data.disable_moonpay);
    },
    sellSuccess(data: SubmitSellData) {
      this.setToAddress(data.address);
      this.setSelectedCurrency(data.selected_currency);
      this.setSelectedFiat(data.selected_fiat);
      this.fiatAmount = data.fiat_amount;
    },
  },
});
</script>

<style lang="scss" scoped>
.component--buy-form {
  position: relative;
  overflow: hidden;
}

.top-container {
  min-height: 540px;
}

.token-select-slider {
  position: absolute;
  bottom: 0;
  left: 0;
  overflow: hidden;
  height: 0%;
  width: 100%;
  transition: height 0.2s ease;
  background-color: white;

  &.open {
    height: 100%;
  }
}
</style>
