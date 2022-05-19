const webpack = require("webpack");
const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  publicPath: "/",
  transpileDependencies: true,
  lintOnSave: true,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve("src"),
      },
    },
  },

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
});
