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
            v-model="networkSelected"
            :items="networks"
            :disabled="loading"
            :menu-props="{ closeOnContentClick: true }"
            :menu="networkDropdown"
            return-object
            variant="outlined"
            @focusin="networkDropdown = true"
            @blur="networkDropdown = false"
          >
            <template #prepend-inner>
              <img
                class="currency-icon mr-1"
                :src="networkIcon"
                :alt="networkSelected.name"
                width="25px"
                height="25px"
              />
            </template>
            <template #item="data">
              <div class="d-flex align-center justify-space-between full-width cursor-pointer" @click="selectNetwork(data.item.value)">
                <div class="d-flex align-center">
                  <img
                    class="currency-icon mr-1 ml-3"
                    :src="getIcon(data.item.value)"
                    :alt="data.item.value"
                    width="25px"
                    height="25px"
                  />
                  <span
                    class="text-capitalize ml-2 my-2 d-flex flex-column"
                  >{{ data.item.value }}</span>
                </div>
              </div>
            </template>
          </v-select>
        </div> -->
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
    }
  },
  mounted() {
    this.networks = Networks;
    console.log('selectedNetwork', this.selectedNetwork);
    console.log('selectedCurrency', this.selectedCurrency);
    this.networkSelected = this.selectedNetwork;
    this.cryptoSelected = this.selectedCurrency;
  },
  methods: {
    reset() {
      this.loading = true;
      this.fetchData = {};
    },
    selectCurrency(currency: Crypto) {
      this.cryptoSelected = currency;
      this.cryptoDropdown = false;
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
</style>