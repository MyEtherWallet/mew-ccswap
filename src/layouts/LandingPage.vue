<template>
  <div
    class="pt-15 component--landing-page"
    :class="[$vuetify.display.mdAndUp ? 'background-lg' : 'background-sm']"
    :style="{ 'background-image': `url(${bg})` }"
  >
    <v-container>
      <v-row>
        <v-col cols="12" md="5" lg="6">
          <Header />
        </v-col>
        <v-col cols="12" md="7" lg="6">
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
  mounted() {},
});
</script>

<style lang="scss" scoped>
.component--landing-page {
  min-height: 100vh;
}

.background-lg {
  background-size: 100vw;
  background-position: left 0px top 0px;
}

.background-sm {
  background-size: cover;
  background-position: right top;
}
</style>
