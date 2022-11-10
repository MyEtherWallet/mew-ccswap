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
          :items="networks"
          :menu-props="{ closeOnContentClick: true }"
          :menu="networkDropdown"
          return-object
          variant="outlined"
          @focusin="networkDropdown = true"
          @blur="networkDropdown = false"
        >
          <template #selection>
            <img
              class="network-icon mr-5"
              :src="networkSelected.icon"
              :alt="networkSelected.name"
              width="28px"
              height="28px"
            />
            <span class="network-selected">
              {{ networkSelected.name_long }}
            </span>
          </template>
          <template #item="data">
            <div
              class="d-flex align-center justify-space-between full-width cursor-pointer"
              @click="selectNetwork(data.item.value)"
            >
              <div class="d-flex align-center">
                <img
                  class="currency-icon mr-1 ml-3"
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
      <!-- Token Selection List -->
      <!-- ============================================================== -->
      <div class="d-flex mt-2">
        <v-list lines="one" class="full-width">
          <v-list-item
            v-for="(item, i) in tokensList"
            :key="i"
            :value="item"
            active-color="primary"
            @click="selectCurrency(item, true)"
          >
            <template #prepend>
              <img
                class="currency-icon mr-3"
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
import { defineComponent, PropType } from 'vue';
import { Crypto, Network, Data, Fiat } from '../types';
import { Networks } from '../network/networks';
import BigNumber from 'bignumber.js';
import { formatFiatValue } from '@/helpers/numberFormatHelper';

export default defineComponent({
  name: 'TokenSelect',
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
  },
  data() {
    return {
      networks: Networks,
      networkSelected: {} as Network,
      cryptoSelected: {} as Crypto,
      networkDropdown: false,
      cryptoDropdown: false,
    };
  },
  computed: {
    cryptoIcon() {
      return require(`@/assets/images/crypto/${this.cryptoSelected.name}.svg`);
    },
    tokensList() {
      const mainCoin = new Crypto(
        this.networkSelected.currencyName,
        this.networkSelected.name_long,
        this.networkSelected.name,
        18,
        this.networkSelected.icon
      );
      let tokensList = [mainCoin];
      if (this.networkSelected.tokens)
        tokensList = tokensList.concat(this.networkSelected.tokens);
      return tokensList;
    },
    fiatName() {
      return this.fiatSelected.name;
    },
  },
  mounted() {
    this.networks = Networks;
    this.networkSelected = this.selectedNetwork;
    this.cryptoSelected = this.selectedCurrency;
  },
  watch: {
    networkSelected() {
      this.selectCurrency(this.tokensList[0]);
    },
  },
  methods: {
    selectCurrency(currency: Crypto, emit = false) {
      this.cryptoSelected = currency;
      this.cryptoDropdown = false;
      if (emit) this.$emit('selectCurrency', this.cryptoSelected);
    },
    selectNetwork(network: Network) {
      this.networkSelected = network;
      this.networkDropdown = false;
    },
    tokenPrice(token: string) {
      const simplexPrice = new BigNumber(
        this.simplexData[token]?.prices[this.fiatName]
      );
      const moonpayPrice = new BigNumber(
        this.moonpayData[token]?.prices[this.fiatName]
      );
      const rate =
        this.moonpayData[token]?.conversion_rates[this.fiatName] ||
        this.simplexData[token]?.conversion_rates[this.fiatName];
      const currencyConfig = { locale: 'en-US', rate, currency: this.fiatName };
      if (moonpayPrice.isNaN())
        return formatFiatValue(simplexPrice.toFixed(2), currencyConfig).value;
      if (simplexPrice.isNaN())
        return formatFiatValue(moonpayPrice.toFixed(2), currencyConfig).value;
      const price = simplexPrice.lte(moonpayPrice)
        ? simplexPrice
        : moonpayPrice;
      return formatFiatValue(price.toFixed(2), currencyConfig).value;
    },
  },
});
</script>

<style lang="scss" scoped>
// Variables
$greyLight-base: #f2f3f6;
$greyPrimary-base: #5a678a;

.network-selected {
  font-family: 'Roboto';
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
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;

  color: #1f242f;
}
</style>
