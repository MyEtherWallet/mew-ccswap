const webpack = require("webpack");
const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === "qa" ? "" : "./",
  transpileDependencies: true,
  lintOnSave: true,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
      new NodePolyfillPlugin(),
    ],
  },
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("web3-name-sdk")
      .test(/node_modules\/@web3-name-sdk\/.*\.js$/)
      .use("babel")
      .loader("babel-loader")
      .end();
    config.module
      .rule("viem")
      .test(/node_modules\/viem\/.*\.js$/)
      .use("babel")
      .loader("babel-loader")
      .end();
    config.module
      .rule("abitype")
      .test(/node_modules\/abitype\/.*\.js$/)
      .use("babel")
      .loader("babel-loader")
      .end();
  },
});
