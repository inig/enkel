<template>
  <div id="app">
    <AppHeader v-if="$route.name !== 'menu'"></AppHeader>
    <router-view style="height: calc(100% - 48px)"></router-view>
    <all-svgs></all-svgs>
    <!-- <UpdateProgress></UpdateProgress> -->
  </div>
</template>

<script>
export default {
  name: 'enkel',
  components: {
    AppHeader: () => import('./components/parts/AppHeader'),
    AllSvgs: () => import('./Svgs.vue'),
    // UpdateProgress: () => import('./components/custom/UpdateProgress')
  },
  created () {
    if (location.href.indexOf('page=menu') > -1) {
      this.$router.replace({
        name: 'menu'
      })
    }
  }
}
</script>

<style lang="less">
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
  -webkit-user-select: none;
}

.no_resize {
  textarea {
    resize: none;
    overflow-y: auto !important;
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
    &:focus {
      box-shadow: none;
    }
  }
  &.disabled {
    textarea {
      border-color: #eeeeee;
    }
  }
}
.custom_drawer {
  .custom_header {
    padding-top: 16px;
  }
}
.request_panel_list {
  .ivu-input {
    background-color: transparent;
    border-color: rgba(71, 72, 70, 0.6);
    color: #c8c8c8;
    &:focus {
      border-color: rgba(71, 72, 70, 1);
      box-shadow: none;
    }
    &:hover {
      border-color: rgba(71, 72, 70, 1);
      box-shadow: none;
    }
    &::placeholder {
      color: rgba(71, 72, 70, 1);
    }
  }
}
.fs12 {
  .ivu-input {
    font-size: 12px;
  }
}
.request_method_select {
  .ivu-select-selection {
    height: 100%;
    background-color: transparent;
    border: none;
  }
  &.ivu-select-visible {
    .ivu-select-selection {
      box-shadow: none;
    }
  }
  &.ivu-select-single {
    .ivu-select-selection {
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}
.request_url_input {
  .ivu-input {
    border: none;
    &:focus {
      box-shadow: none;
      border-color: transparent;
    }
  }
}
.request_btn_box {
  .ivu-btn-text {
    &:focus {
      box-shadow: none;
    }
  }
}
.request_send_form {
  .ivu-tabs-ink-bar {
    background-color: #fcfcfc;
  }
  .ivu-tabs-nav {
    .ivu-tabs-tab {
      color: rgb(152, 152, 152);
      &:hover {
        color: rgb(222, 222, 222);
      }
    }
    .ivu-tabs-tab-active {
      color: rgb(222, 222, 222);
    }
  }
  .ivu-tabs {
    height: 100%;
    .ivu-tabs-content {
      height: calc(100% - 52px);
    }
  }
  .ivu-tabs-bar {
    border-bottom: 1px solid #474846;
  }
}
.custom_right {
  .ivu-tabs {
    // height: calc(100% - 48px);
    height: 100%;
    .ivu-tabs-content {
      height: calc(100% - 52px);
    }
  }
}
.json_form_item {
  .ivu-input {
    background-color: transparent;
    box-shadow: none;
    border: none;
    border-bottom: 1px solid #474846;
    color: rgb(217, 217, 217);
    border-radius: 0;
    &:focus {
      box-shadow: none;
      border-color: #474846;
    }
    &:hover {
      border-color: #474846;
    }
    &::placeholder {
      color: rgb(81, 81, 80);
    }
  }
  .ivu-checkbox-inner {
    background-color: transparent;
    border: 1px solid rgb(153, 153, 153);
  }
  .ivu-checkbox-checked {
    .ivu-checkbox-inner {
      // background-color: rgb(94, 160, 33);
      // border-color: rgb(94, 160, 33);
      background-color: rgb(167, 149, 251);
      border-color: rgb(167, 149, 251);
    }
    &:hover {
      .ivu-checkbox-inner {
        border-color: rgb(167, 149, 251);
      }
    }
  }
}
.screenshot_form_item {
  .ivu-input {
    background-color: transparent;
    box-shadow: none;
    border: none;
    border-bottom: 1px solid #c8c8c8;
    color: rgb(81, 81, 80);
    border-radius: 0;
    &:focus {
      box-shadow: none;
      border-color: #c8c8c8;
    }
    &:hover {
      border-color: #c8c8c8;
    }
    &::placeholder {
      color: rgb(200, 200, 200);
    }
  }
  .ivu-checkbox-inner {
    background-color: transparent;
    border: 1px solid rgb(153, 153, 153);
  }
  .ivu-checkbox-checked {
    .ivu-checkbox-inner {
      // background-color: rgb(94, 160, 33);
      // border-color: rgb(94, 160, 33);
      background-color: rgb(167, 149, 251);
      border-color: rgb(167, 149, 251);
    }
    &:hover {
      .ivu-checkbox-inner {
        border-color: rgb(167, 149, 251);
      }
    }
  }
}
.request_result {
  .ivu-tabs-nav-scroll {
    height: 47px;
    .ivu-tabs-nav {
      height: 47px;
      .ivu-tabs-tab {
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
.emulator_settings {
  .ivu-select-selection {
    background-color: transparent;
    border: none;
  }
  .ivu-select-visible {
    .ivu-select-selection {
      border-color: transparent;
      box-shadow: none;
    }
  }
}
</style>
