<template>
  <div class="component--footer py-2">
    <v-container class="text-center">
      <img src="@/assets/images/icon-mew-logo-dark.svg" alt="MEW" height="23" />
      <div>©2018 MyEtherWallet Inc. All rights reserved</div>

      <h3 class="font-weight-regular mb-3">
        Need Ethereum wallet? Get one from
        <a href="https://www.myetherwallet.com/wallet/create" target="_blank">
          <span class="text--primary font-weight-bold">
            myetherwallet.com
          </span>
        </a>
      </h3>

      <v-btn
        @click="openInNewTab('https://www.myetherwallet.com/wallet/create')"
        x-small
        height="32px"
      >
        <h4 class="font-weight-medium">Get Ethereum wallet</h4>
      </v-btn>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Footer',
  components: {},
  data() {
    return {};
  },
  methods: {
    openInNewTab(url) {
      window.open(url, '_blank').focus();
    },
  },
  mounted() {},
});
</script>

<style lang="scss" scoped>
.component--footer {
  background-color: #05c0a5;
}
</style>
