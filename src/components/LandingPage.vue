<template>
  <div class="pt-10 background" :style="{ 'background-image': `url(${bg1})` }">
    <Header />
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from './header/Header.vue';
import Footer from './footer/Footer.vue';
import bg1 from '@/assets/images/bg-bar-1.svg';

export default defineComponent({
  name: 'Landing',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      bg1: bg1,
    };
  },
});
</script>

<style lang="scss" scoped>
.background {
  background-size: 1200px;
  background-position: right -100px top -374px;
}
</style>
