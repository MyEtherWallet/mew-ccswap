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
          label="Network"
          v-model="networkSelected"
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
                @click.stop="(e) => e.preventDefault()"
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
            v-for="(item, i) in filteredNetworkTokens"
            :key="i"
            :value="item"
            base-color="primary"
            @click="selectCurrency(item)"
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
                  {{ ` - ${item.name}` }}
                </span>
              </div>
            </v-list-item-title>
            <!-- <template #append>
              <span>{{ tokenPrice(item.symbol) }}</span>
            </template> -->
          </v-list-item>
        </v-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, Ref, computed, defineEmits } from "vue";
import { Crypto } from "../types";

import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/plugins/globalStore";
import { Network } from "../network/types";
const { selectedNetwork, buyNetworks, sellNetworks } = storeToRefs(
  useGlobalStore()
);

const { setSelectedNetwork, setSelectedCrypto } = useGlobalStore();

// emit
const emit = defineEmits(["selectedNetwork", "selectCurrency", "close"]);

// props
const props = defineProps({
  close: {
    type: Function,
    default: () => ({}),
  },
  isSell: {
    type: Boolean,
    default: false,
  },
});

// reactive data
const networkSelected: Ref<Network> = ref<Network>(selectedNetwork.value);

const searchInput: Ref<string> = ref("");
const networkSearchInput: Ref<string> = ref("");

const filteredNetworkList: Ref<Network[]> = computed<Network[]>(() => {
  const withTokensNetwork = props.isSell
    ? sellNetworks.value
    : buyNetworks.value;
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

const filteredNetworkTokens = computed<Crypto[]>(() => {
  const filterText = searchInput.value.toLowerCase();
  const tokensCopy = networkSelected.value.tokens?.slice();
  if (filterText === "") return tokensCopy;
  return tokensCopy.filter((token) => {
    const tokenSymbol = token.symbol.toLowerCase();
    const tokenSubtext = token.subtext.toLowerCase();
    const tokenName = token.name.toLowerCase();
    if (
      tokenSymbol.includes(filterText) ||
      tokenName.includes(filterText) ||
      tokenSubtext.includes(filterText)
    )
      return token;
  });
});

// methods
const selectNetwork = (passedNetwork: Network) => {
  setSelectedNetwork(passedNetwork);
  if (passedNetwork.tokens.length === 1) {
    setSelectedCrypto(passedNetwork.tokens[0]);
  } else {
    const findMain = passedNetwork.tokens.find(
      (token) => token.symbol === passedNetwork.name
    );
    if (findMain) {
      setSelectedCrypto(findMain);
    }
  }
  networkSelected.value = passedNetwork;
};

const selectCurrency = (token: Crypto) => {
  setSelectedCrypto(token);
  close();
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
