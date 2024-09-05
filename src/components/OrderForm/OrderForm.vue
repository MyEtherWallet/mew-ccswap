<template>
  <div
    class="top-container component--buy-form elevated-box elevation-4 pa-3 pa-sm-6 pa-md-8"
  >
    <div v-if="step === 0">
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

    <div class="token-select-slider" :class="step === 1 ? 'open' : ''">
      <TokenSelect
        v-if="step === 1"
        class="pa-3 pa-sm-6 pa-md-8"
        :is-sell="isSell"
        @close="close"
      />
    </div>

    <BuyProviders v-if="step === 2" @close="close" @reset="reset" />
  </div>
</template>

<script lang="ts" setup>
import { isEmpty } from "lodash";

import { ref, inject, computed } from "vue";
import MewTabs from "../MewTabs/MewTabs.vue";
import BuyForm from "./BuyForm.vue";
import BuyProviders from "./BuyProviders.vue";
import TokenSelect from "./components/TokenSelect.vue";
import SellForm from "./SellForm.vue";

import { Networks } from "./network/networks";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/plugins/globalStore";
import { defaultCrypto, defaultFiat } from "./handler/defaults";

const amplitude: any = inject("$amplitude");

const { setSelectedCrypto, setSelectedFiat, setSelectedNetwork } =
  useGlobalStore();

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
