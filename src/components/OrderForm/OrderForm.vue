<template>
  <div
    class="top-container component--buy-form elevated-box elevation-4 pa-3 pa-sm-6 pa-md-8"
  >
    <div
      :class="[isTokenModalOpen ? 'open' : '', 'token-select-slider']"
      v-if="isTokenModalOpen"
    >
      <TokenSelect
        class="pa-3 pa-sm-6 pa-md-8"
        :is-sell="isSell"
        @close="close"
      />
    </div>

    <BuyProviders
      v-else-if="isBuyProvidersOpen"
      @close="close"
      @reset="reset"
    />

    <div v-else>
      <MewTabs
        :items="tabItems"
        :active-tab="activeTab"
        base-color="greenPrimary"
        has-underline
        @onTab="onTab"
      >
        <template #tabContent1>
          <BuyForm />
        </template>
        <template #tabContent2>
          <SellForm />
        </template>
      </MewTabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";

import MewTabs from "../MewTabs/MewTabs.vue";
import BuyForm from "./BuyForm.vue";
import BuyProviders from "./BuyProviders.vue";
import TokenSelect from "./components/TokenSelect.vue";
import SellForm from "./SellForm.vue";

import { Networks } from "./network/networks";
import { useGlobalStore } from "@/plugins/globalStore";
import { defaultCrypto, defaultFiat } from "./handler/defaults";

const amplitude: any = inject("$amplitude");

const {
  setSelectedCrypto,
  setSelectedFiat,
  setSelectedNetwork,
  toggleBuyProviders,
  toggleTokenModal,
  setCgPrice,
  setExchangeRates,
} = useGlobalStore();

const { isTokenModalOpen, isBuyProvidersOpen } = storeToRefs(useGlobalStore());

// data
const tabItems = ["Buy", "Sell"];
const activeTab = ref(0);
const step = ref(0);

// mounted
onMounted(() => {
  prices();
  exchangeRates();
});

// computed
const isSell = computed(() => {
  return activeTab.value === 1;
});

// watchers
watch(
  () => isSell.value,
  (isSell) => {
    if (isSell) {
      setSelectedFiat(defaultFiat);
    }
  }
);

// methods
const close = () => {
  if (isTokenModalOpen.value) {
    toggleTokenModal();
  }
  if (isBuyProvidersOpen.value) {
    toggleBuyProviders();
  }
};

const reset = () => {
  setSelectedCrypto(defaultCrypto);
  setSelectedFiat(defaultFiat);
  setSelectedNetwork(Networks[0]);
  close();
};

const onTab = (tab: number) => {
  activeTab.value = tab;
  step.value = 1;
  amplitude.track(`CCBuySell${tab === 0 ? "BuyTab" : "SellTab"}`);
};

const exchangeRates = async () => {
  const ratesFetch = await fetch(
    "https://mainnet.mewwallet.dev/v2/prices/exchange-rates"
  );
  const rates = await ratesFetch.json();
  setExchangeRates(rates);
};

const prices = async () => {
  const tokensFetch = await fetch("https://api-v3.ethvm.dev/", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: '{"operationName":null,"variables":{},"query":"{\\n  getCoinGeckoTokenPriceAll {\\n    id\\n    usd\\n    last_updated_iso8601\\n  }\\n}\\n"}',
  });
  const tokens = await tokensFetch.json();
  setCgPrice(tokens.data.getCoinGeckoTokenPriceAll);
};
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
