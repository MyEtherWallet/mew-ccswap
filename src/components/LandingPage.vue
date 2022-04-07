<template>
  <Header />
  <BuyForm />
  <Footer />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from './header/Header.vue';
import BuyForm from './body/buy-form/BuyForm.vue';
import Footer from './footer/Footer.vue';

export default defineComponent({
  name: 'Landing',
  components: {
    Header,
    BuyForm,
    Footer,
  },
  data() {
    return {};
  },
});
</script>
