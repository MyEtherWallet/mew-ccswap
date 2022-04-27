<template>
  <div v-if="formData" class="component--submit-form">
    <h1 class="font-weight-bold">(Simplex) form submit</h1>
    <h2 class="font-weight-bold">
      for development only. This block will be hidden when eveything is done.
    </h2>
    <div class="mt-3">Simplex API document about form submission</div>
    <a
      href="https://integrations.simplex.com/wallet-api-integration#payment-form"
      target="_blank"
    >
      <h4 style="color: blue">
        https://integrations.simplex.com/wallet-api-integration#payment-form
      </h4>
    </a>

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
        <input type="text" name="return_url_success" :value="returnUrl" />
      </div>

      <div>
        <div>return_url_fail</div>
        <input type="text" name="return_url_fail" :value="returnUrl" />
      </div>

      <div>
        <div>payment_id</div>
        <input type="text" name="payment_id" :value="formData.payment_id" />
      </div>

      <div class="mt-15">
        <input type="submit" value="Submit" />
      </div>
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
  margin: 20px 0;
}

input {
  display: block;
  border: 1px solid black;
  margin: 10px 0;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
}

* {
  color: black;
}
</style>
