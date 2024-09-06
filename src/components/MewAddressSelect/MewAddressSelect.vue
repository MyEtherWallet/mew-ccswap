<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <!-- ===================================================================================== -->
  <!-- Mew Address Select -->
  <!-- ===================================================================================== -->
  <v-combobox
    ref="mewAddressSelect"
    v-model="locAddress"
    class="address-select pa-0 rounded-lg"
    color="primary"
    :label="label"
    item-value="address"
    item-text="address"
    :placeholder="placeholder"
    :disabled="disabled"
    :error-messages="errors"
    :messages="resolved ? addressValue : ''"
    :rules="rules"
    :no-data-text="noDataText"
    :menu-props="{ closeOnContentClick: true }"
    variant="outlined"
    @update:search-input="onChange"
    @update:model-value="debouncedChange"
  >
    <!-- ===================================================================================== -->
    <!-- Blockie: displays placeholder if invalid address, otherwise displays -->
    <!-- the correct blockie. The blockie is always displayed at the beginning -->
    <!-- of the input. -->
    <!-- ===================================================================================== -->
    <template #prepend-inner>
      <div
        v-if="!isValidAddress || !blockieHash"
        class="blockie-placeholder mr-1 selectHover"
      />
      <mew-blockie
        v-if="isValidAddress"
        class="mr-1"
        :address="blockieHash"
        width="25px"
        height="25px"
      />
    </template>
    <template #message>
      <div>
        <span v-if="resolved" class="overline primary--text font-weight-medium">
          {{ addressValue }}
        </span>
        <div v-if="errors.length > 0">
          <span
            v-for="err in errors"
            :key="err"
            class="error font-weight-medium"
          >
            {{ err }}
          </span>
        </div>
      </div>
    </template>

    <!-- ===================================================================================== -->
    <!-- Displays each item in the dropdown. -->
    <!-- ===================================================================================== -->
    <!-- <template #item="{ item }">
      <div
        class="py-4 px-0 full-width d-flex align-center justify-space-between cursor-pointer"
        @click="selectAddress(item)"
      >
        <div class="d-flex align-center justify-space-between">
          <mew-blockie
            class="mr-2 ml-2"
            :address="item.raw.address"
            width="25px"
            height="25px"
          />
          <div class="d-flex align-center">
            <span class="mew-address">{{ item.raw.address }}</span>
            <span>{{ item.raw.address.slice(-4) }}</span>
          </div>
        </div>
        <div class="overline primary--text font-weight-medium ml-3 mr-3">
          {{ item.raw.nickname }}
        </div>
      </div>
    </template> -->
  </v-combobox>
</template>

<script lang="ts">
import MewBlockie from "@/components/MewBlockie/MewBlockie.vue";
import { defineComponent } from "vue";
import Resolver from "../OrderForm/handler/Resolver";
import { Network } from "../OrderForm/types";
import { debounce } from "lodash";

// data
const USER_INPUT_TYPES = {
  typed: "TYPED",
  selected: "SELECTED",
};

interface ComponentInterface {
  onInputChange(value: string): void;
}

export default defineComponent({
  name: "MewAddressSelect",
  components: {
    MewBlockie,
  },
  props: {
    /**
     * value passed
     */
    modelValue: {
      type: String,
      default: "",
    },
    /**
     * For validating your input - accepts an array of functions that take
     * an input value as an argument and return either true / false or a
     * string with an error message.
     */
    rules: {
      type: Array,
      default: () => {
        return [];
      },
    },
    /**
     * The text to display if there is no data.
     */
    noDataText: {
      type: String,
      default: "",
    },
    /**
     * Disables the input.
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Returns if the address is valid or not.
     */
    isValidAddress: {
      type: Boolean,
      default: false,
    },
    /**
     * The input label.
     */
    label: {
      type: String,
      default: "To Address",
    },
    /**
     * The input placeholder.
     */
    placeholder: {
      type: String,
      default: "Please enter an address",
    },
    /**
     * Error messages to display when its an invalid value.
     */
    errorMessages: {
      type: [String, Array],
      default: "",
    },
    /**
     * Clear address
     */
    clearAddress: {
      type: Boolean,
      default: false,
    },
    network: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      /**
       * The v-model value for the combobox.
       */
      addressValue: this.modelValue,
      /**
       * Indicates whether the user selected from dropdown or typed in the address
       */
      isTyped: USER_INPUT_TYPES.typed,
      err: "",
      locAddress: "",
      resolved: false,
    };
  },
  computed: {
    /**
     * If the input item is a name (i.e, ens) and has a valid resolved address,
     * display the blockie for the resolved address otherwise display
     * the blockie for the regular address value.
     */
    blockieHash(): string {
      return this.addressValue ? this.addressValue : this.locAddress;
    },
    errors(): any {
      if (this.errorMessages.length > 0) {
        return this.errorMessages;
      }
      if (this.err) {
        return [this.err];
      }
      return [];
    },
  },
  watch: {
    clearAddress() {
      this.clear();
    },
    modelValue(val) {
      this.addressValue = val;
    },
  },
  methods: {
    /**
     * Clears the v-model value.
     */
    clear() {
      this.addressValue = "";
    },
    /**
     * Sets the dropdown item to be the v-model value.
     */
    selectAddress(data: { value: any; raw: any }) {
      this.isTyped = USER_INPUT_TYPES.selected;
      const addressSelect = Object.assign<any, any>(
        {},
        this.$refs.mewAddressSelect
      );
      this.addressValue = data.raw.address;
      addressSelect.modelValue = this.addressValue;
      this.onChange(this.addressValue);
    },
    /**
     * Emits 'changed' when there is a v-model value change.
     */
    onChange(value: string) {
      this.$emit("changed", value, this.isTyped);
    },
    debouncedChange: debounce(function (
      this: ComponentInterface,
      value: string
    ) {
      this.onInputChange(value);
    },
    500),
    /**
     * Sets the value for what the user types int
     */
    async onInputChange(data: string) {
      const resolver = new Resolver(this.network as Network);
      if (!data) {
        this.locAddress = "";
        this.addressValue = "";
        this.err = "";
        this.onChange(this.locAddress);
        return;
      }
      try {
        const name = await resolver.resolveName(
          data as string,
          this.network.symbol
        );
        this.isTyped = USER_INPUT_TYPES.typed;
        this.locAddress = data;
        this.addressValue = name ? name : data ? data : "";
        this.err = "";
        this.resolved = name ? true : false;
        this.onChange(this.addressValue);
      } catch (e: any) {
        this.resolved = false;
        if (e.message === "Invalid name!") {
          this.locAddress = data;
          this.addressValue = "";
          this.onChange(this.locAddress);
        } else {
          this.err = e.message;
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.mew-address {
  display: inline-block;
  max-width: 170px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.error {
  font-weight: 300;
  font-size: 0.9rem;
  color: red;
}
</style>

<style lang="scss">
.v-application {
  /**
      * Address select input.
      */
  .address-select {
    /**
      * Right icons
      */
    .v-field__append-inner {
      cursor: pointer;
    }
    .v-input__append-inner {
      height: 100%;
      margin-top: 0;
    }
    .icon-container {
      .v-icon {
        &:hover {
          color: var(--v-primary-base) !important;
        }
      }
    }
    &.v-select.v-input--is-focused {
      .mdi-chevron-down {
        color: var(--v-titlePrimary-base);
      }
    }
    .dropdown-icon-container {
      border-left: 1px solid var(--v-disabled-base);
      margin-left: 15px;
      margin-right: -15px;
    }
  }
}
</style>
