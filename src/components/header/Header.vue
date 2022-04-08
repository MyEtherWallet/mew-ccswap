<template>
  <v-container>
    <v-row>
      <v-col cols="5">
        <img
          src="@/assets/images/icon-mew-logo-dark.svg"
          alt="MEW"
          height="36"
        />

        <div class="heading-1 mt-15" style="max-width: 350px">
          Buy Ethereum at Lower Rates
        </div>

        <div class="d-flex align-center mt-12">
          <div class="mr-2">Powered by</div>
          <img
            src="@/assets/images/icon-simplex.svg"
            alt="Simplex"
            height="30"
          />
        </div>

        <div class="d-flex align-center mt-4">
          <div class="mr-2">
            We accept
            <span class="font-weight-medium text-decoration-underline"
              >Visa</span
            >
            and
            <span class="font-weight-medium text-decoration-underline"
              >MasterCard</span
            >
          </div>
          <img
            class="mr-2"
            src="@/assets/images/icon-visa.svg"
            alt="Visa"
            height="16"
          />
          <img src="@/assets/images/icon-master.svg" alt="Master" height="22" />
        </div>
      </v-col>
      <v-col cols="7">
        <BuyForm />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BuyForm from '@/components/body/buy-form/BuyForm.vue';

export default defineComponent({
  name: 'Header',
  components: {
    BuyForm,
  },
  data() {
    return {};
  },
});
</script>
