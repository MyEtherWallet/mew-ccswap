<template>
  <v-app>
    <div class="fade-effect-init" :class="[fadeIn ? 'fade-in' : '']">
      <v-main>
        <LandingPageOldDesign />
        <LandingPage />
      </v-main>
    </div>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LandingPageOldDesign from '@/layouts/LandingPageOldDesign/LandingPageOldDesign.vue';
import LandingPage from '@/layouts/LandingPage/LandingPage.vue';

export default defineComponent({
  name: 'App',
  components: {
    //LandingPageOldDesign,
    LandingPage,
  },
  data() {
    return {
      fadeIn: false,
      useOldDesign: true,
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
