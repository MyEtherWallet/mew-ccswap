<template>
  <v-app>
    <div class="fade-effect-init" :class="[fadeIn ? 'fade-in' : '']">
      <v-main>
        <LandingPage />
      </v-main>
    </div>
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
    return {
      fadeIn: false,
    };
  },
  mounted() {
    // Wait until page is fully loaded
    window.addEventListener('load', () => {
      this.fadeIn = true;
    });
  },
});
</script>

<style lang="scss" scoped>
.fade-effect-init {
  opacity: 0;
  transition: opacity 0.5s ease;
  &.fade-in {
    opacity: 1;
  }
}
</style>

<style lang="scss">
@import '@/styles/global.scss';
</style>
