<template>
<div id="app">
    <router-view />
</div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'App'
})
</script>

<style lang="scss">
@import '@/var.scss';
@import './main.scss';
</style>
