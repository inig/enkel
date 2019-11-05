<template>
  <div id="app">
    <AppHeader v-if="$route.name !== 'menu'"></AppHeader>
    <router-view style="height: calc(100% - 48px)"></router-view>
    <all-svgs></all-svgs>
  </div>
</template>

<script>
export default {
  name: 'enkel',
  components: {
    AppHeader: () => import('./components/parts/AppHeader'),
    AllSvgs: () => import('./Svgs.vue')
  }
}
</script>

<style>
/* CSS */
* {
  margin: 0;
  padding: 0;
  -webkit-user-select: none;
}
html,
body {
  height: 100%;
}
#app {
  height: 100%;
}
</style>
