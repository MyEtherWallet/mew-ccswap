<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
    <div>
      <div
        class="d-flex align-center textDark--text mb-10"
      >
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
            :disabled="loading"
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
              <span class="network-selected"> {{ networkSelected.name_long }} </span>
            </template>
            <template #item="data">
              <div class="d-flex align-center justify-space-between full-width cursor-pointer" @click="selectNetwork(data.item.value)">
                <div class="d-flex align-center">
                  <img
                    class="currency-icon mr-1 ml-3"
                    :src="data.item.value.icon"
                    :alt="data.item.value.name"
                    width="25px"
                    height="25px"
                  />
                  <span
                    class="ml-2 my-2 d-flex flex-column"
                  >{{ data.item.value.name_long }}</span>
                </div>
              </div>
            </template>
          </v-select>
        </div>
    
        <!-- ============================================================== -->
        <!-- Token Selection -->
        <!-- ============================================================== -->
        <!-- <div class="d-flex mt-2">
          <v-select
            class="full-width"
            v-model="cryptoSelected"
            :items="tokensList"
            :disabled="loading"
            :menu-props="{ closeOnContentClick: true }"
            :menu="cryptoDropdown"
            return-object
            variant="outlined"
            @focusin="cryptoDropdown = true"
            @blur="cryptoDropdown = false"
          >
          <template #selection>
            <img
              class="network-icon mr-5"
              :src="cryptoSelected.img"
              :alt="cryptoSelected.name"
              width="28px"
              height="28px"
            />
            <span class="text--bold">{{ cryptoSelected.name }} -&nbsp;</span>
            <span>{{ cryptoSelected.subtext }}</span>
          </template>
            <template #item="data">
              <div class="d-flex align-center justify-space-between full-width cursor-pointer" @click="selectCurrency(data.item.value)">
                <div class="d-flex align-center">
                  <img
                    class="currency-icon mr-1 ml-3"
                    :src="data.item.value.img"
                    :alt="data.item.value.name"
                    width="25px"
                    height="25px"
                  />
                  <span
                    class="text-capitalize ml-2 my-2 d-flex flex-column"
                  >{{ data.item.value.name }} -&nbsp;</span>
                  <span>{{ data.item.value.subtext }}</span>
                </div>
              </div>
            </template>
          </v-select>
        </div> -->
        <!-- ============================================================== -->
        <!-- Token Selection Table -->
        <!-- ============================================================== -->
        <div class="d-flex mt-2">
          <v-select
            class="full-width"
            v-model="cryptoSelected"
            :items="tokensList"
            :disabled="loading"
            :menu-props="{ closeOnContentClick: true }"
            :menu="cryptoDropdown"
            return-object
            variant="outlined"
            @focusin="cryptoDropdown = true"
            @blur="cryptoDropdown = false"
          >
          <template #selection>
            <img
              class="network-icon mr-5"
              :src="cryptoSelected.img"
              :alt="cryptoSelected.name"
              width="28px"
              height="28px"
            />
            <span class="text--bold">{{ cryptoSelected.name }} -&nbsp;</span>
            <span>{{ cryptoSelected.subtext }}</span>
          </template>
            <template #item="data">
              <div class="d-flex align-center justify-space-between full-width cursor-pointer" @click="selectCurrency(data.item.value)">
                <div class="d-flex align-center">
                  <img
                    class="currency-icon mr-1 ml-3"
                    :src="data.item.value.img"
                    :alt="data.item.value.name"
                    width="25px"
                    height="25px"
                  />
                  <span
                    class="text-capitalize ml-2 my-2 d-flex flex-column"
                  >{{ data.item.value.name }} -&nbsp;</span>
                  <span>{{ data.item.value.subtext }}</span>
                </div>
              </div>
            </template>
          </v-select>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Crypto, Network } from '../types';
import { Networks } from '../networks';

export default defineComponent({
  name: 'TokenSelect',
  props: {
    close: {
      type: Function,
      default: () => ({})
    },
    selectedNetwork: {
        type: Object as PropType<Network>,
        default: () => ({})
    },
    selectedCurrency: {
        type: Object as PropType<Crypto>,
        default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      fetchData: {},
      networks: Networks as Array<Network>,
      networkSelected: {} as Network,
      cryptoSelected: {} as Crypto,
      networkDropdown: false,
      cryptoDropdown: false
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
    }
  },
  mounted() {
    this.networks = Networks;
    this.networkSelected = this.selectedNetwork;
    this.cryptoSelected = this.selectedCurrency;
  },
  watch: {
    networkSelected() {
      this.selectCurrency(this.tokensList[0]);
    }
  },
  methods: {
    reset() {
      this.loading = true;
      this.fetchData = {};
    },
    selectCurrency(currency: Crypto) {
      this.cryptoSelected = currency;
      this.cryptoDropdown = false;
      this.$emit('selectCurrency', this.cryptoSelected);
    },
    selectNetwork(network: Network) {
      this.networkSelected = network;
      this.networkDropdown = false;
    }
  }
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

    color: #1F242F;

    flex: none;
    order: 1;
    flex-grow: 0;
}
.text--bold {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;

    color: #1F242F;
}
</style>