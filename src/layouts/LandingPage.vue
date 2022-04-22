<template>
  <div
    class="pt-15 component--landing-page"
    :class="[$vuetify.display.mdAndUp ? 'background-lg' : 'background-sm']"
    :style="{ 'background-image': `url(${bgBar})` }"
  >
    <div
      class="background-space-man"
      :class="[
        $vuetify.display.lg ? 'background-space-man-lg' : '',
        $vuetify.display.xlAndUp ? 'background-space-man-xl' : '',
      ]"
      :style="{ 'background-image': `url(${bgSpaceMan})` }"
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
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/header/Header.vue';
import Footer from '@/components/footer/Footer.vue';
import BuyForm from '@/components/buy-form/BuyForm.vue';
import Promo from '@/components/promo/Promo.vue';
import BgBar from '@/assets/images/bg-bar.svg';
import BgSpaceMan from '@/assets/images/bg-space-man.svg';

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
      bgBar: BgBar,
      bgSpaceMan: BgSpaceMan,
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

.background-space-man {
  background-size: 0px;
}

.background-space-man-lg {
  background-size: 347px;
  background-position: calc(50% - 43px) 379px;
}

.background-space-man-xl {
  margin: 0 auto;
  max-width: 2565px;
  background-size: 603px;
  background-position: calc(50% + 854px) 54px;
}
</style>
