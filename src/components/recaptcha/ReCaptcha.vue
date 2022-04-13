<template>
  <div v-show="false">reCaptcha</div>
</template>

<script>
import { useReCaptcha } from 'vue-recaptcha-v3';

export default {
  name: 'ReCaptcha',
  emits: ['token'],

  setup(props, { emit }) {
    const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

    const recaptcha = async () => {
      // (optional) Wait until recaptcha has been loaded.
      await recaptchaLoaded();

      // Execute reCAPTCHA with action "login".
      const token = await executeRecaptcha('login');

      // Do stuff with the received token.
      emit('token', token);
    };

    recaptcha();

    return {
      recaptcha,
    };
  },
};
</script>

<style lang="scss" scoped></style>
