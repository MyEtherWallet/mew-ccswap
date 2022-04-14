<template>
  <div>
    <img src="@/assets/images/icon-mew-logo-dark.svg" alt="MEW" height="36" />

    <div class="heading-1 mt-15" style="max-width: 400px">
      Buy Crypto at Great Price!
    </div>

    <div class="mt-10">
      <p>
        Myetherwallet is one of the first movers in the crypto space to be
        awarded Principal Member of the Visa network, enabling us to offer debit
        cards to you, so you can offer them directly to your users.
      </p>
      <p>
        As the industry leader, we empower hundreds of partners to enable
        millions of people to buy billions of dollars in digital assets.
      </p>
    </div>

    <div class="d-flex align-center mt-12">
      <div class="mr-2">Powered by</div>
      <img src="@/assets/images/icon-simplex.svg" alt="Simplex" height="30" />
    </div>

    <div class="d-flex align-center mt-4">
      <div class="mr-2">
        We accept
        <span class="font-weight-medium text-decoration-underline">Visa</span>
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
