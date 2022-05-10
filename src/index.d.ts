/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "*.png";
declare module "*.svg";
declare module "*.jpg";

declare module 'order.ts';
declare module 'prices.ts';
declare module 'multicoin-address-validator';