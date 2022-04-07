<template>
  <v-app>
    <v-main>
      <LandingPage />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LandingPage from './components/LandingPage.vue';

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
