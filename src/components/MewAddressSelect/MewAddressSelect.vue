<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <!-- ===================================================================================== -->
  <!-- Mew Address Select -->
  <!-- ===================================================================================== -->
  <v-combobox
    ref="mewAddressSelect"
    v-model="addressValue"
    class="address-select pa-0 rounded-lg"
    color="primary"
    :items="items"
    :label="label"
    item-value="address"
    item-text="address"
    :placeholder="placeholder"
    :disabled="disabled"
    :error-messages="errorMessages"
    :hint="hint || resolvedAddr || ''"
    :persistent-hint="resolvedAddr.length > 0 || hint.length > 0"
    :rules="rules"
    :no-data-text="noDataText"
    :menu-props="{ closeOnContentClick: true }"
    :menu="dropdown"
    variant="outlined"
    @focusin="dropdown = true"
    @update:search-input="onChange"
    @blur="dropdown = false"
    @update:model-value="onInputChange"
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

    <!-- ===================================================================================== -->
    <!-- Displays each item in the dropdown. -->
    <!-- ===================================================================================== -->
    <template #item="{ item }">
      <div
        class="py-4 px-0 full-width d-flex align-center justify-space-between cursor-pointer"
        @click="selectAddress(item)"
      >
        <div class="d-flex align-center justify-space-between full-max-width">
          <mew-blockie
            class="mr-2 ml-2"
            :address="
              item.raw.resolvedAddr ? item.raw.resolvedAddr : item.raw.address
            "
            width="25px"
            height="25px"
          />
          <mew-transform-hash
            v-if="!item.raw.resolvedAddr || item.raw.resolvedAddr === ''"
            :hash="item.raw.address"
          />
          <span v-else class="mew-address">{{ item.raw.address }}</span>
        </div>
        <div class="overline primary--text font-weight-medium ml-3">
          {{ item.raw.nickname }}
        </div>
      </div>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import MewBlockie from '@/components/MewBlockie/MewBlockie.vue';
import MewTransformHash from '../MewTransformHash/MewTransformHash.vue';
import { defineComponent } from 'vue';

// data
const USER_INPUT_TYPES = {
  typed: 'TYPED',
  selected: 'SELECTED',
};

export default defineComponent({
  name: 'MewAddressSelect',
  components: {
    MewBlockie,
    MewTransformHash,
  },
  props: {
    /**
     * Text displayed under the input container.
     */
    hint: {
      type: String,
      default: '',
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
      default: '',
    },
    /**
     * Resolved address for name.
     */
    resolvedAddr: {
      type: String,
      default: '',
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
      default: 'To Address',
    },
    /**
     * The items that are displayed in the dropdown.
     * Currently takes an array of objects, i.e { address: '', nickname: ''}
     */
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
    /**
     * The input placeholder.
     */
    placeholder: {
      type: String,
      default: 'Please enter an address',
    },
    /**
     * Error messages to display when its an invalid value.
     */
    errorMessages: {
      type: [String, Array],
      default: '',
    },
    /**
     * Clear address
     */
    clearAddress: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      /**
       * The v-model value for the combobox.
       */
      addressValue: '',
      /**
       * Controls the dropdown expansion.
       */
      dropdown: false,
      /**
       * Indicates whether the user selected from dropdown or typed in the address
       */
      isTyped: USER_INPUT_TYPES.typed,
    };
  },
  computed: {
    /**
     * If the input item is a name (i.e, ens) and has a valid resolved address,
     * display the blockie for the resolved address otherwise display
     * the blockie for the regular address value.
     */
    blockieHash(): string {
      return this.resolvedAddr.length > 0
        ? this.resolvedAddr
        : this.addressValue;
    },
  },
  watch: {
    clearAddress() {
      this.clear();
    },
  },
  methods: {
    /**
     * Clears the v-model value.
     */
    clear() {
      this.addressValue = '';
    },
    /**
     * Toggles the dropdown.
     */
    toggle() {
      this.dropdown = !this.dropdown;
    },
    /**
     * Sets the dropdown item to be the v-model value.
     */
    selectAddress(data: { value: any, raw: any }) {
      this.dropdown = false;
      this.isTyped = USER_INPUT_TYPES.selected;
      const addressSelect = Object.assign<any, any>({}, this.$refs.mewAddressSelect);
      this.addressValue = data.value.address;
      addressSelect.modelValue = this.addressValue;
      this.onChange(this.addressValue);
    },
    /**
     * Emits 'changed' when there is a v-model value change.
     */
    onChange(value: string) {
      this.$emit('changed', value, this.isTyped);
    },
    /**
     * Sets the value for what the user types int
     */
    onInputChange(data: {address: string}) {
      this.isTyped = USER_INPUT_TYPES.typed;
      this.addressValue = data.address ? data.address : data.toString();
      this.onChange(this.addressValue);
    },
  },
});
</script>

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
