<template>
  <div class="component--footer py-2">
    <v-container class="text-center">
      <img
        src="@/assets/images/icon-mew-logo-light.svg"
        alt="MEW"
        height="25"
      />
      <div>©2018 MyEtherWallet Inc. All rights reserved</div>

      <div class="font-weight-regular mb-3">
        Need Ethereum wallet? Get one from
        <a href="https://www.myetherwallet.com/wallet/create" target="_blank">
          <span class="text--primary font-weight-bold">
            myetherwallet.com
          </span>
        </a>
      </div>

      <v-btn
        @click="openInNewTab('https://www.myetherwallet.com/wallet/create')"
        size="small"
      >
        Get Ethereum wallet
      </v-btn>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FooterComponent',
  components: {},
  data() {
    return {};
  },
  methods: {
    openInNewTab(url) {
      window.open(url, '_blank').focus();
    }
  },
  mounted() {}
});
</script>

<style lang="scss" scoped>
.component--footer {
  background-color: #05c0a5;
  position: relative;
  z-index: 1;
}
</style>
