<template>
  <div class="component--footer">
    <v-container class="text-center">
      <div>©2018 MyEtherWallet Inc. All rights reserved</div>
      <div class="mb-2">
        Need an Ethereum wallet? Get one from
        <span class="font-weight-bold">myetherwallet.com</span> for free.
      </div>
      <v-btn
        @click="openInNewTab('https://www.myetherwallet.com/wallet/create')"
        x-small
        height="42px"
        >Get a wallet</v-btn
      >
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
