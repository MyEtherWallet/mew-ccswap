<template>
  <div class="buynow--banner py-9">
    <v-container
      class="d-flex justify-space-around align-center"
      style="max-width: 1000px"
    >
      <v-btn
        class="buy--btn rounded-pill text-white text-none"
        color="buynow--banner-btn"
        @click="scrollTop"
      >
        <h2 class="font-weight-bold">Buy Now</h2>
      </v-btn>
    </v-container>
  </div>
</template>

<script setup>
const scrollTop = () => {
  window.scrollTo(0, 0);
};
</script>

<style lang="scss" scoped>
.buynow--banner {
  background-color: rgb(var(--v-theme-buynow--banner));
  width: 100vw;
}

.buy--btn {
  width: 300px;
  height: 64px;

  h2 {
    color: rgb(var(--v-theme-buynow--banner-btn-text));
  }
}
</style>
