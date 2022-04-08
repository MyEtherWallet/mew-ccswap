<template>
  <v-app>
    <v-main>
      <LandingPage />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LandingPage from '@/layouts/LandingPage.vue';

export default defineComponent({
  name: 'App',

  components: {
    LandingPage,
  },

  data() {
    return {};
  },
});
</script>

<style lang="scss">
@import '@/styles/global.scss';
</style>
