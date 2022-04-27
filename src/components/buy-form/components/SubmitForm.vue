<template>
  <div v-if="formData" class="component--submit-form">
    <h1 class="font-weight-bold">Simplex form submit</h1>
    <h2 class="font-weight-bold">for dev only</h2>

    <form action="https://checkout.simplexcc.com/payments/new" method="post">
      <div>
        <div>version</div>
        <input type="text" name="version" :value="formData.version" />
      </div>

      <div>
        <div>partner</div>
        <input type="text" name="partner" :value="formData.partner" />
      </div>

      <div>
        <div>payment_flow_type</div>
        <input
          type="text"
          name="payment_flow_type"
          :value="formData.payment_flow_type"
        />
      </div>

      <div>
        <div>return_url_success</div>
        <input
          type="text"
          name="return_url_success"
          :value="formData.return_url_success"
        />
      </div>

      <div>
        <div>return_url_fail</div>
        <input
          type="text"
          name="return_url_fail"
          :value="formData.return_url_fail"
        />
      </div>

      <div>
        <div>payment_id</div>
        <input type="text" name="payment_id" :value="formData.payment_id" />
      </div>

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
  padding: 30px;
  border-radius: 20px;
}

form > div {
  margin: 20px 0;
}

input {
  display: block;
  border: 1px solid black;
  margin: 10px 0;
  padding: 5px;
}
</style>
