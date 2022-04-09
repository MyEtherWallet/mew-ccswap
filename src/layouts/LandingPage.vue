<template>
  <div
    class="pt-15 component--landing-page background"
    :style="{ 'background-image': `url(${bg})` }"
  >
    <v-container>
      <v-row>
        <v-col cols="5">
          <Header />
        </v-col>
        <v-col cols="7">
          <BuyForm />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <Promo />
        </v-col>
      </v-row>
    </v-container>

    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/header/Header.vue';
import Footer from '@/components/footer/Footer.vue';
import BuyForm from '@/components/buy-form/BuyForm.vue';
import Promo from '@/components/promo/Promo.vue';
import bg from '@/assets/images/bg-bar-2.svg';

export default defineComponent({
  name: 'Landing',
  components: {
    Header,
    Footer,
    BuyForm,
    Promo,
  },
  data() {
    return {
      bg: bg,
    };
  },
});
</script>

<style lang="scss" scoped>
.component--landing-page {
  min-height: 100vh;
}

.background {
  background-size: 100vw;
  //background-size: 1200px;
  background-position: left 0px top 0px;
}
</style>
