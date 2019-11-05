<template>
  <div id="app">
    <router-view></router-view>
    <all-svgs></all-svgs>
  </div>
</template>

<script>
  export default {
    name: 'enkel',
    components: {
      AllSvgs: () => import('./Svgs.vue')
    }
  }
</script>

<style>
  /* CSS */
  * {
    margin: 0;
    padding: 0;
  }
  html,
  body {
    height: 100%;
  }
  #app {
    height: 100%;
  }
</style>
