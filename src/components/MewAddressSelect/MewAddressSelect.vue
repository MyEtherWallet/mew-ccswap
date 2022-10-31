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
    :menu-props="{ modelValue: dropdown, closeOnContentClick: true }"
    outlined
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
    <template #append>
      <!-- ===================================================================================== -->
      <!-- Dropdown arrow. Toggles the dropdown. -->
      <!-- ===================================================================================== -->
      <div
        class="dropdown-icon-container d-flex align-center justify-center cursor-pointer full-height"
        @click="toggle"
      >
        <v-icon class="mew-heading-1 mx-5"> mdi-chevron-down </v-icon>
      </div>
    </template>

    <!-- ===================================================================================== -->
    <!-- Displays each item in the dropdown. -->
    <!-- ===================================================================================== -->
    <template #item="{ item }">
      <div
        :class="[
          'py-4 px-0 full-width d-flex align-center justify-space-between',
          // 'column-reverse align-baseline',
          // $vuetify.breakpoint.smAndDown ? 'column-reverse align-baseline' : '',
        ]"
        @click="selectAddress(item)"
      >
        <div class="d-flex align-center justify-space-between full-max-width">
          <mew-blockie
            class="mr-2"
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
      // return this.addressValue.address || this.addressValue;
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
    selectAddress(data: { value: string }) {
      console.log('data', data);
      console.log('items', this.items);
      this.dropdown = false;
      this.isTyped = USER_INPUT_TYPES.selected;
      const addressSelect = this.$refs.mewAddressSelect as any;
      console.log('addressSelect', addressSelect);
      // addressSelect.select(data); // Works but throws errors
      this.addressValue = data.value;
      console.log('addressValue', this.addressValue);
      addressSelect.modelValue = this.addressValue;
      console.log('addressSelect.modelValue', addressSelect.modelValue);
    },
    /**
     * Emits 'input' when there is a v-model value change.
     */
    onChange(value: string) {
      this.$emit('input', value, this.isTyped);
    },
    /**
     * Sets the value for what the user types int
     */
    onInputChange(value: string) {
      this.isTyped = USER_INPUT_TYPES.typed;
      this.addressValue = value;
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
    min-height: 62px;
    &.v-text-field {
      input {
        font-family: 'PT Mono';
      }
    }
    /**
      * Right icons
      */
    .v-input__append-inner {
      height: 100%;
      margin-top: 0;
    }
    .icon-container {
      .copy-icon {
        font-size: 20px;
      }
      .save-icon {
        font-size: 22px;
        margin-top: 3px;
      }
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
