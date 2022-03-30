import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require("path");

export default defineConfig({
    plugins: [
        vue(),
    ],
    resolve: {
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
        "@": path.resolve(__dirname, "./src"),
        "~@": path.resolve(__dirname, "./src"),
    },
    build: {
        assetsPublicPath: '',
        
    },
    dev: {
        assetsPublicPath: '/',
    },
    vue: 'vue/dist/vue.esm-bundler.js'
    },
});