<template>
  <div class="app_header">
    <div class="menu_fold"
         v-if="$route.name !== 'home' && !menuFolded"
         @click="menuFold">
      <svg>
        <use :xlink:href="'#' + (menuFolded ? 'menu-unfold' : 'menu-fold')"></use>
      </svg>
    </div>
    <div class="menu_fold bgWhite"
         v-if="$route.name !== 'home' && menuFolded"
         @click="menuFold">
      <img src="../../assets/logo.png"
           alt="Enkel">
    </div>
    <slot>
      Enkel
    </slot>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  export default {
    name: 'AppHeader',
    data () {
      return {
        menuFolded: false
      }
    },
    mounted () {
      ipcRenderer.on('menu-folded', () => {
        this.menuFolded = true
      })
      ipcRenderer.on('menu-unfolded', () => { this.menuFolded = false })
    },
    methods: {
      menuFold () {
        ipcRenderer.send(!this.menuFolded ? 'menu-fold' : 'menu-unfold')
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url("../../themes/index.less");
  .bgWhite {
    background-color: #000 !important;
  }
  .app_header {
    position: relative;
    width: 100%;
    height: 48px;
    cursor: move;
    background-color: @primary-color;
    -webkit-app-region: drag;
    color: #ffffff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    -webkit-user-select: none;
  }
  .menu_fold {
    position: absolute;
    width: 48px;
    height: 48px;
    left: 0;
    top: 0;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    svg {
      width: 20px;
      height: 20px;
      fill: #ffffff;
    }
    &:hover {
      svg {
        fill: #c8c8c8;
      }
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>