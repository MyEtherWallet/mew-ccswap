<template>
  <div v-if="formData && false" class="component--submit-form">
    <h2 class="font-weight-bold">
      Simplex payment form submit for development only
    </h2>
    <h3 class="mt-3">Hide this block when eveything is done</h3>
    <h3 class="mt-3">Simplex API document about form submission</h3>
    <a
      href="https://integrations.simplex.com/wallet-api-integration#payment-form"
      target="_blank"
    >
      https://integrations.simplex.com/wallet-api-integration#payment-form
    </a>

    <!-- ========================================================================================= -->
    <!-- form START -->
    <!-- ========================================================================================= -->
    <form
      action="https://checkout.simplexcc.com/payments/new"
      method="POST"
      target="_self"
    >
      <!------------------------------------->
      <!-- version -->
      <!------------------------------------->
      <div>version</div>
      <input type="text" name="version" :value="formData.version" />

      <!------------------------------------->
      <!-- partner -->
      <!------------------------------------->
      <div>partner</div>
      <input type="text" name="partner" :value="formData.partner" />

      <!------------------------------------->
      <!-- payment_flow_type -->
      <!------------------------------------->
      <div>payment_flow_type</div>
      <input
        type="text"
        name="payment_flow_type"
        :value="formData.payment_flow_type"
      />

      <!------------------------------------->
      <!-- return_url_success -->
      <!------------------------------------->
      <div>return_url_success</div>
      <input type="text" name="return_url_success" :value="returnUrl" />

      <!------------------------------------->
      <!-- return_url_fail -->
      <!------------------------------------->
      <div>return_url_fail</div>
      <input type="text" name="return_url_fail" :value="returnUrl" />

      <!------------------------------------->
      <!-- payment_id -->
      <!------------------------------------->
      <div>payment_id</div>
      <input type="text" name="payment_id" :value="formData.payment_id" />

      <!------------------------------------->
      <!-- submit button -->
      <!------------------------------------->
      <div>
        Click to submit the form manually. This will redirect this page to
        Simplex payment confirmation page.
      </div>
      <input type="submit" value="Submit" />
    </form>
    <!-- ========================================================================================= -->
    <!-- form END -->
    <!-- ========================================================================================= -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SubmitForm',
  components: {},
  props: {
    formData: Object,
    returnUrl: String,
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
  border: 10px solid black;
  padding: 30px;
  border-radius: 20px;
  background-color: #efefef;
}

form > div {
  margin: 20px 0 0 0;
}

input {
  display: block;
  border: 1px solid black;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
}

* {
  color: black;
}
</style>
