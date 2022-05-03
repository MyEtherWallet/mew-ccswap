<template>
  <div>
    <img src="@/assets/images/icon-mew-logo-dark.svg" alt="MEW" height="36" />

    <div class="heading-1 mt-15" style="max-width: 400px">
      Buy Crypto at Great Price!
    </div>

    <div class="subtitle mt-8 mb-15">
      Myetherwallet is one of the first movers in the crypto space to be awarded
      Principal Member of the Visa network, enabling us to offer debit cards to
      you, so you can offer them directly to your users.
    </div>

    <div class="mb-4 font-weight-light" style="max-width: 400px">
      As the industry leader, we empower hundreds of partners to enable millions
      of people to buy billions of dollars in digital assets.
    </div>

    <div class="d-flex align-center">
      <div class="mr-2">Powered by</div>
      <img src="@/assets/images/icon-simplex.svg" alt="Simplex" height="30" />
    </div>

    <div class="d-flex flex-wrap align-center mt-4">
      <div class="mr-2">
        We accept
        <span class="font-weight-medium text-decoration-underline">Visa</span>
        and
        <span class="font-weight-medium text-decoration-underline"
          >MasterCard</span
        >
      </div>
      <div class="d-flex align-center">
        <img
          class="mr-2"
          src="@/assets/images/icon-visa.svg"
          alt="Visa"
          height="16"
        />
        <img src="@/assets/images/icon-master.svg" alt="Master" height="22" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Header',
  components: {},
  data() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.subtitle {
  font-size: 1.6rem;
  line-height: 2.4rem;
  font-weight: 300;
}
</style>
