<template>
  <div class="component--promo">
    <div>
      <h1>We have increased maximum limits for hassle free transactions</h1>
    </div>
    <div style="margin-top: 100px">
      <h1>That is the reason why millions of our users choose us</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Promo',
  components: {},
  data() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.component--promo {
  padding-top: 200px;
}

h1 {
  max-width: 700px;
}
</style>
