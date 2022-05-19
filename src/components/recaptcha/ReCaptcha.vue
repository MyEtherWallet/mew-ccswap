<template>
  <div
    class="verified-box d-flex align-center flex-wrap justify-space-between"
    style="padding: 13px 18px 13px 18px"
  >
    <div v-if="loading" class="d-flex align-center">
      <v-progress-circular indeterminate color="#05c0a5"></v-progress-circular>
      <h3
        style="max-width: 150px; color: #05c0a5"
        class="ml-4 font-weight-medium"
      >
        Google reCaptcha is running....
      </h3>
    </div>

    <div v-if="!loading && verified">
      <h4 class="font-weight-medium" style="max-width: 200px; color: #05c0a5">
        Google reCaptcha v3 verification successful
      </h4>
      <div class="d-flex align-center">
        <v-icon size="35" color="#05c0a5">mdi-check</v-icon>
        <div class="ml-1 font-weight-medium" style="color: #05c0a5">
          You are not a bot
        </div>
      </div>
    </div>

    <div v-if="!loading && !verified">
      <h4
        class="font-weight-medium warning--text"
        style="max-width: 200px; color: #fb8c00"
      >
        Google reCaptcha verification failed
      </h4>
      <h3 class="d-flex align-center">
        <v-icon size="45" color="warning">mdi-close</v-icon>
        <div class="ml-1 font-weight-medium" style="color: #fb8c00">
          Please try again
        </div>
      </h3>
    </div>

    <img
      src="@/assets/images/icon-recaptcha.svg"
      alt="ReCaptcha"
      :height="$vuetify.display.mobile ? 40 : 68"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent } from "vue";
import { useReCaptcha } from "vue-recaptcha-v3";

defineComponent({
  name: "ReCaptcha",
  emits: ["token"],
  setup(props, { emit }) {
    const loading = ref(true);
    const verified = ref(false);

    const recaptcha = async () => {
      const recaptchaLib = useReCaptcha();
      if (!recaptchaLib) {
        throw new Error("reCaptcha couldn't load!");
      }
      // (optional) Wait until recaptcha has been loaded.
      await recaptchaLib.recaptchaLoaded();

      // Execute reCAPTCHA with action "login".
      const token = await recaptchaLib.executeRecaptcha("login");

      // Do stuff with the received token.
      if (token) {
        emit("token", token);
        loading.value = false;
        verified.value = true;
      }
    };

    recaptcha();

    return {
      recaptcha,
      verified,
      loading,
    };
  },
});
</script>

<style lang="scss" scoped>
.verified-box {
  border: 1px solid #bebebe;
  border-radius: 6px;
  background-color: #f9f9f9;
}
</style>
