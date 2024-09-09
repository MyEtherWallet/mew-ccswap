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
import { ref, inject, computed } from "vue";
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

const { setSelectedCrypto, setSelectedFiat, setSelectedNetwork } =
  useGlobalStore();

const { isTokenModalOpen, isBuyProvidersOpen } = storeToRefs(useGlobalStore());

// data
const tabItems = ["Buy", "Sell"];
const activeTab = ref(0);
const step = ref(0);

// computed
const isSell = computed(() => {
  return activeTab.value === 1;
});

// methods
const close = () => {
  step.value = 0;
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
