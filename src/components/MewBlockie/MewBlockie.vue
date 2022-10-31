<template>
  <div>
    <div
      v-show="address"
      style="position: relative"
      :style="`width: ${width}; height: ${height}`"
    >
      <img
        ref="blockie"
        :src="blockieImg"
        alt="Blockie Image"
        style="display: block; border-radius: 50%"
      />

      <!--
        =====================================================================
        Inset shadow on edge of blockie image
        =====================================================================
        -->
      <div v-if="!flat" class="inset-shadow" />
    </div>
    <img v-if="currency" alt="icon" class="currency-icon" :src="currency" />
  </div>
</template>

<script lang="ts">
import Blockies from '@/helpers/blockies';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MewBlockie',
  props: {
    /**
     * Currency image url
     */
    currency: {
      type: String,
      default: '',
    },
    /**
     * Valid address
     */
    address: {
      type: String,
      default: '',
    },
    /**
     * Blockie width
     */
    width: {
      type: String,
      default: '64px',
    },
    /**
     * Blockie height
     */
    height: {
      type: String,
      default: '64px',
    },
    /**
     * Remove inset shadow
     */
    flat: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scale: 16,
      size: 8,
      blockieImg: '',
    };
  },
  watch: {
    address() {
      this.createBlockie();
    },
    width() {
      this.createBlockie();
    },
    height() {
      this.createBlockie();
    },
    scale() {
      this.createBlockie();
    },
    size() {
      this.createBlockie();
    },
  },
  mounted() {
    this.createBlockie();
  },
  methods: {
    createBlockie() {
      this.blockieImg = Blockies({
        seed: this.address ? this.address.toLowerCase() : '',
        size: this.size,
        scale: this.scale,
      }).toDataURL();
      const blockieElem = this.$refs.blockie as HTMLImageElement;
      blockieElem.style.width = this.width;
      blockieElem.style.height = this.height;
    },
  },
});
</script>

<style lang="scss" scoped>
.inset-shadow {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  box-shadow: inset 0px 0px 4px #939393;
  height: 100%;
  width: 100%;
}
</style>
