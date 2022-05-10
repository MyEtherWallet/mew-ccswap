<template>
  <div>
    <img src="@/assets/images/icon-mew-logo-dark.svg" alt="MEW" height="36" />

    <div
      :class="$vuetify.display.smAndUp ? 'heading-1' : 'heading-1'"
      :style="
        $vuetify.display.smAndUp
          ? 'margin-top: 100px; max-width: 340px'
          : 'margin-top: 50px;  max-width: 340px'
      "
    >
      Buy Ethereum at Lower Rates
    </div>

    <div class="d-flex align-center" style="margin-top: 60px">
      <div class="mr-2 text--secondary">Powered by</div>
      <img src="@/assets/images/icon-simplex.svg" alt="Simplex" height="30" />
    </div>

    <div class="d-flex flex-wrap align-center mt-4">
      <div class="mr-2 text--secondary">
        We accept
        <span
          class="font-weight-medium text-decoration-underline text--secondary"
        >
          Visa
        </span>
        and
        <span
          class="font-weight-medium text-decoration-underline text--secondary"
        >
          MasterCard
        </span>
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
import { defineComponent } from "vue";

export default defineComponent({
  name: "HeaderComponent",
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
