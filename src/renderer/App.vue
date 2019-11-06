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

<style lang="less">
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

  .no_resize {
    textarea {
      resize: none;
    }
  }
  .ta_h_100p {
    height: 100%;
    textarea {
      height: 100% !important;
    }
  }
  .ta_bg_gray {
    textarea {
      background-color: #fcfcfc !important;
    }
  }
  .custom_textarea {
    height: 100%;
    textarea {
      resize: none;
      height: 100% !important;
      background-color: #fcfcfc !important;
      border-color: #eeeeee;
    }
  }
</style>
