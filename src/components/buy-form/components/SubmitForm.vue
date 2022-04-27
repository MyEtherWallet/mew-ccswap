<template>
  <div v-if="formData" class="component--submit-form">
    <div>Simplex payment submit form for dev only</div>

    <form action="https://checkout.simplexcc.com/payments/new" method="post">
      <input type="text" name="version" :value="formData.version" />
      <input type="text" name="partner" :value="formData.partner" />
      <input
        type="text"
        name="payment_flow_type"
        :value="formData.payment_flow_type"
      />

      <input
        type="text"
        name="return_url_success"
        :value="formData.return_url_success"
      />
      <input
        type="text"
        name="return_url_fail"
        :value="formData.return_url_fail"
      />
      <input type="text" name="payment_id" :value="formData.payment_id" />
      <input type="submit" value="Submit" />
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SubmitForm',
  components: {},
  props: {
    formData: Object,
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {},
});
</script>

<style lang="scss" scoped>
.component--submit-form {
  border: 3px solid black;
  padding: 10px;
}
input {
  display: block;
  border: 1px solid black;
  margin: 10px 0;
  padding: 5px;
}
</style>
