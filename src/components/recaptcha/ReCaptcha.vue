<template>
  <button @click="recaptcha">Execute recaptcha</button>
</template>

<script>
import { useReCaptcha } from 'vue-recaptcha-v3';

export default {
  name: 'ReCaptcha',
  setup() {
    const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

    const recaptcha = async () => {
      // (optional) Wait until recaptcha has been loaded.
      await recaptchaLoaded();

      // Execute reCAPTCHA with action "login".
      const token = await executeRecaptcha('login');

      // Do stuff with the received token.
      console.log({ token });
    };
    recaptcha();

    return {
      recaptcha,
    };
  },
};
</script>

<style lang="scss" scoped></style>
