<template>
  <div id="app">
    <AppHeader v-if="(!$route.meta || (!$route.meta.withoutHeader))"></AppHeader>
    <router-view :style="containerHeight"></router-view>
    <!-- <router-view :style="{height: ($route.name !== 'menu' && ($route.name !== 'modal-loading')) ? 'calc(100% - 48px)' : '100%'}"></router-view> -->
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
      if (location.href.indexOf('page=') > -1) {
        let pathName = location.href.replace(/^([^?]*\?[^?]*page=)([^&#/]*)(.*)$/, '$2')
        this.$router.replace({
          name: pathName
        })
      }
    },
    computed: {
      containerHeight () {
        if (this.$route.meta && this.$route.meta.withoutHeader) {
          return {
            height: '100%'
          }
        } else {
          return {
            height: 'calc(100% - 48px)'
          }
        }
      }
    }
  }
</script>

<style lang="less">
  // @import url("/static/css/ace/themes/theme-tomorrow-night.css");
  @import url("./assets/css/animate.min.css");
  html,
  body {
    background: rgba(0, 0, 0, 0);
  }
  body::-webkit-scrollbar{
    width:0;
    -webkit-app-region: no-drag !important;
  }
  .drag {
    -webkit-app-region: drag !important;
  }
  textarea, input, button, a, .profile_menu_item, .pin, .header-btns, .upload-plugin-container, .friend_item, .group_item, .profile_item_inner, .chat_window_header_back, .msg_box_left_content, .msg_box_right_content, .play_box_mood_control, .play_box_heart, .media_fm_side_bar, .vjs-control-bar, .playlist_container, .play_file_container, .download_container, .video_box_pin, .video_box_top_right_controls_item {
    -webkit-app-region: no-drag !important;
  }
  .noDrag {
    -webkit-app-region: no-drag !important;
  }
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
      border-color: #dcdee2;
      &:focus {
        box-shadow: none;
        border-color: #dcdee2;
      }
      &:hover {
        box-shadow: none;
        border-color: #dcdee2;
      }
    }
    &.disabled {
      textarea {
        border-color: #dcdee2;
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
  .flac_search_header {
    .ivu-input {
      background-color: transparent;
      border-color: transparent;
      // border-color: rgba(71, 72, 70, 0.6);
      color: #c8c8c8;
      width: calc(~"100% - 80px");
      &:focus {
        border-color: transparent;
        // border-color: rgba(71, 72, 70, 1);
        box-shadow: none;
      }
      &:hover {
        border-color: transparent; // rgba(71, 72, 70, 1);
        box-shadow: none;
      }
      &::placeholder {
        color: rgba(80, 80, 80, 1);
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
    &.light {
      .ivu-input {
        border-bottom: 1px solid #f0f0f0;
        &:focus {
          box-shadow: none;
          border-color: #474846;
        }
        &:hover {
          border-color: #474846;
        }
        &::placeholder {
          color: rgb(108, 108, 108);
        }
      }
    }
    .modified {
      .ivu-input {
        color: #ed4014;
        text-decoration: line-through;
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

  .menu_operate_dropdown {
    .ivu-dropdown-rel {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }

  .emphasize {
    color: #99ff00 !important;
  }
  .emphasize2 {
    color: #ff6600 !important;
    font-weight: bold;
  }

  .requests_footer_btn {
    &.ivu-btn {
      span {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .settings_container {
    .ivu-progress-show-info .ivu-progress-outer {
      padding-right: 130px !important;
    }
    .ivu-progress-text {
      position: absolute;
      width: 130px;
      right: 0;
      top: 2px;
      white-space: nowrap;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .ivu-form {
      .table_header {
        .ivu-form-item-label {
          color: #9e9e9e !important;
        }
      }
    }
  }

  .custom_input {
    .ivu-input {
      background-color: transparent;
      border: none;
      color: #aaa;
    }
    .ivu-input-search {
      background: transparent;
      border-color: transparent;
    }
    .ivu-input:hover,
    .ivu-input:focus {
      border-color: transparent;
    }
    .ivu-input:focus {
      box-shadow: none;
    }
    .ivu-input::placeholder {
      font-size: 12px;
      color: #666;
    }
    .ivu-input-group-prepend {
      background-color: transparent;
      border: none;
      font-size: 12px;
      color: #888;
      padding-top: 3px !important;
    }
  }
  .ivu-tooltip-rel {
    height: 100%;
    display: flex !important;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .video_control_item {
    width: 40px;
    height: 30px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    img {
      width: 18px;
      height: 18px;
    }
  }

  .video_box_middle {
    // .ivu-slider-bar {
    //   background: #33ff00;
    // }
    // .ivu-slider-button {
    //   border: 2px solid #33ff00;
    // }
    .ivu-slider-wrap {
      background-color: #151619;
    }
    .ivu-slider-bar {
      background: #4fc08d;
    }
    // .ivu-slider-button {
    //   border: 2px solid #4fc08d;
    // }
  }

  .profile_content_inner .ivu-input {
    border: none;
    text-align: right;
    background-color: transparent;
  }
  .profile_content_inner .ivu-input:focus {
    border: none;
    box-shadow: none;
  }
  .msg_send_input .ivu-input {
    border: none;
    background-color: transparent;
    resize: none;
  }
  .msg_send_input .ivu-input:focus {
    border: none;
    box-shadow: none;
  }

  .member_item .group_master {
    font-size: 10px !important;
    height: 16px !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .group_member_add_form .ivu-modal-content {
    height: 100%;
  }
  .group_member_add_form .ivu-modal-content .ivu-modal-body {
    height: 349px;
  }

  img[lazy="loading"] {
    width: 20px;
    height: 20px;
    transition: all 0.2s ease-in-out;
    // opacity: 0;
  }
  img[lazy="loaded"] {
    /*your style here*/
    opacity: 1;
  }
</style>
