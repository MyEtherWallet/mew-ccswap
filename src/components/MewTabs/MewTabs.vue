<!-- eslint-disable vue/no-v-for-template-key-on-child -->
<template>
    <!-- ===================================================================================== -->
    <!-- Mew Tabs -->
    <!-- ===================================================================================== -->
    <div>
      <!-- ================================================================= -->
      <!-- Compact(Mobile) tabs -->
      <!-- ================================================================= -->
      <div v-if="compact">
        <!-- ========================================= -->
        <!-- Mobile tabs selector buttons -->
        <!-- ========================================= -->
        <v-chip-group
          v-model="onTab"
          mandatory
          column
        >
          <v-chip
            v-for="(mobileItem, mobileItemKey) in items"
            :key="mobileItemKey"
            class="ma-1"
            active-class="greenPrimary text--primary"
            outlined
          >
            {{ mobileItem }}
          </v-chip>
        </v-chip-group>
  
        <!-- ========================================= -->
        <!-- Mobile tabs contents -->
        <!-- ========================================= -->
        <template>
          <div v-for="(mobileItem, mobileItemKey) in items" :key="mobileItemKey">
            <slot
              v-if="onTab == mobileItemKey"
              :name="'tabItemContent' + (mobileItemKey + 1)"
            />
          </div>
        </template>
      </div>
  
      <!-- ================================================================= -->
      <!-- Desktop tabs -->
      <!-- ================================================================= -->
      <v-tabs
        v-if="!compact"
        v-model="onTab"
        :class="tabClasses"
        :background-color="background"
        :color="activeColor"
        :centered="isCentered"
        slider-size="3"
        :hide-slider="isBlock || isVertical"
        :grow="isBlock || hasFullWidth"
        :vertical="isVertical"
        :show-arrows="showArrows"
        :align-with-title="!isBlock && !isCentered && !isVertical"
      >
        <v-tab
          v-for="(item, i) in items"
          :key="`${item}` + i"
          :class="[
            isBlock
              ? 'mew-tab-block'
              : isVertical || isSmall
                ? 'mew-body font-weight-medium'
                : 'mew-heading-2',
            'capitalize'
          ]"
          :ripple="!isVertical"
        >
          {{ item }}
        </v-tab>
        <v-window v-model="onTab">
          <v-window-item
            v-for="(item, i) in items"
            :key="`${item}` + i"
            :value="item"
            :reverse-transition="
              !isVertical ? 'slide-x-transition' : 'slide-y-transition'
            "
          >
            <!-- ===================================================================================== -->
            <!-- Slot: 'tabItemContent' + number of tab content (used to place custom tab -->
            <!-- content inside of the tab container) -->
            <!-- ===================================================================================== -->
            <slot :name="'tabItemContent' + (i + 1)" />
          </v-window-item>
        </v-window>
      </v-tabs>
  
      <div
        v-for="(item, i) in items"
        :key="`${item}` + i"
      >
        <v-slide-x-reverse-transition
          :hide-on-leave="true"
          mode="out-in"
        >
          <!-- ===================================================================================== -->
          <!-- Slot: 'tabContent' + number of tab content (used to place custom tab -->
          <!-- content outside of the tab container) -->
          <!-- ===================================================================================== -->
          <slot
            v-if="onTab === i"
            :name="'tabContent' + (i + 1)"
          />
        </v-slide-x-reverse-transition>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'MewTabs',
    props: {
      /**
       * Sets the color for active tab.
       * If nothing passed, titlePrimary will be used.
       */
      activeColor: {
        type: String,
        default: 'titlePrimary'
      },
      /**
       * Sets the color for the background of mew-tabs.
       * If nothing passed, transparent will be used.
       */
      background: {
        type: String,
        default: 'transparent'
      },
      /**
       * Displays arrows if tab items overflow container.
       */
      showArrows: {
        type: Boolean,
        default: false
      },
      /**
       * Sets the active tab.
       */
      activeTab: {
        type: Number,
        default: 0
      },
      /**
       * Sets the tabs as vertical.
       */
      hasUnderline: {
        type: Boolean,
        default: false
      },
      /**
       * Sets the tabs as vertical.
       */
      isVertical: {
        type: Boolean,
        default: false
      },
      /**
       * Sets the tabs to the center of the page.
       */
      isCentered: {
        type: Boolean,
        default: false
      },
      /**
       * Tab content
       */
      items: {
        type: Array,
        default: () => {
          return [];
        }
      },
      /**
       * Shows the tab as a block.
       */
      isBlock: {
        type: Boolean,
        default: false
      },
      /**
       * Allows tabs to take up the full-width of the page.
       */
      hasFullWidth: {
        type: Boolean,
        default: false
      },
      /**
       * Sets the font size to 14px (mew-body)
       */
      isSmall: {
        type: Boolean,
        default: false
      },
      compact: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        onTab: this.activeTab
      };
    },
    computed: {
      tabClasses() {
        const classes = ['mew-tabs'];
        if (this.hasUnderline) {
          classes.push('mew-tabs-underline');
        }
        if (this.isBlock) {
          classes.push('mew-tabs-block elevation-3');
        }
        return classes;
      }
    },
    watch: {
      activeTab(newVal: number) {
        this.onTab = newVal;
      },
      onTab(newVal: number) {
        this.$emit('onTab', newVal);
      }
    },
    mounted() {
      this.onTab = this.activeTab;
    }
  });
  </script>
  
  <style lang="scss">
  .mew-tabs-underline {
    .v-slide-group__content {
      border-bottom: 1px solid var(--v-inputBorder-base);
    }
  }
  .mew-tabs-block {
    border-radius: 12px !important;
  
    .mew-tab-block {
      background-color: var(--v-white-base);
      color: var(--v-basic-base) !important;
    }
  
    .v-tab--active {
      background: var(--v-basic-base);
      color: var(--v-white-base) !important;
    }
  
    .mew-tab-block:first-of-type {
      border-radius: 12px 0px 0px 12px;
    }
  
    .mew-tab-block:last-of-type {
      border-radius: 0px 12px 12px 0px;
    }
  }
  
  .mew-tabs {
    &.v-tabs--vertical > .v-tabs-bar .v-tab {
      display: flex;
      justify-content: flex-start;
      padding-left: 0;
      &:hover {
        text-decoration: underline;
      }
      &:before {
        background-color: transparent;
      }
    }
  }
  </style>
  
  <style lang="scss" scoped>
  .v-chip--active {
    border: 2px solid var(--v-greenPrimary-base) !important;
  
    &::before {
      background-color: white;
    }
  }
  </style>