<template>
  <div class="component--footer py-2">
    <v-container class="text-center">
      <img :src="mewIconLight" alt="MEW" height="25" />
      <div class="my-5">
        <div footer--text style="color: white">
          ©{{ presentDate }} MyEtherWallet Inc. All rights reserved
        </div>

        <div class="font-weight-regular" style="color: white">
          Need Ethereum wallet? Get one from
          <a
            href="https://www.myetherwallet.com/wallet/create"
            target="_blank"
            style="color: white; text-decoration: none"
          >
            myetherwallet.com
          </a>
        </div>
      </div>

      <v-btn
        size="x-large"
        class="rounded-pill white--text mt-3 text-none"
        color="#7b61ff"
        href="https://www.myetherwallet.com/wallet/create"
        target="_blank"
        style="color: white"
      >
        Get a wallet
      </v-btn>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import mewIconLight from '@/assets/images/icon-mew-logo-light.svg';

const presentDate = new Date().getFullYear();
</script>

<style lang="scss" scoped>
.component--footer {
  background-color: black;
  position: relative;
  z-index: 1;
}
</style>
