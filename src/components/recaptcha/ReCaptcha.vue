<template>
  <VueReCaptcha />
</template>

<script lang="ts">
import { createApp } from 'vue';
import { VueReCaptcha, useReCaptcha } from 'vue-recaptcha-v3';

const component = {
  setup() {
    const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

    const recaptcha = async () => {
      // (optional) Wait until recaptcha has been loaded.
      await recaptchaLoaded();

      // Execute reCAPTCHA with action "login".
      const token = await executeRecaptcha('login');

      // Do stuff with the received token.
    };

    return {
      recaptcha,
    };
  },
};

createApp(component).use(VueReCaptcha, {
  siteKey: '6LcOkkwfAAAAAHs-bw2WrXHJtcdDWKl7S4JktET9',
});
</script>
