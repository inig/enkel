<template>
  <div class="tool_container base64_container">
    <ESplit v-model="split1"
            min="160px"
            max="300px">
      <div slot="left"
           class="custom_left">
        <PanelList :request-methods="requestMethods"
                   @active="setActiveItem"></PanelList>
      </div>
      <div slot="trigger"
           class="custom_trigger">
      </div>
      <div slot="right"
           class="custom_right">
        <ESplit v-model="split2"
                min="60px">
          <div slot="left"
               class="custom_sub_left">
            <RequestForm :active-request="activeRequest"></RequestForm>
          </div>
          <div slot="trigger"
               class="custom_trigger">
          </div>
          <div slot="right"
               class="custom_sub_right">
            <RequestResult></RequestResult>
          </div>
        </ESplit>
      </div>
    </ESplit>
  </div>
</template>

<script>
  export default {
    name: 'Request',
    components: {
      ESplit: () => import('../../../custom/ESplit'),
      PanelList: () => import('./PanelList'),
      RequestForm: () => import('./RequestForm'),
      RequestResult: () => import('./RequestResult')
    },
    data () {
      return {
        split1: 0.2,
        split2: 0.5,
        requestMethods: [
          {
            name: 'GET',
            color: '#745be6'
          },
          {
            name: 'POST',
            color: 'rgb(94, 160, 33)'
          }
        ],
        activeRequest: {}
      }
    },
    methods: {
      setActiveItem (data) {
        this.activeRequest = JSON.parse(JSON.stringify(data))
      }
    }
  }
</script>

<style lang="less" scoped>
  .tool_container {
    height: 100%;
    .input_box {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: #fff;
      padding: 15px;
      box-sizing: border-box;
    }
    .custom_left {
      width: 100%;
      height: 100%;
      background-color: rgb(46, 47, 43);
    }
    .custom_trigger {
      width: 1px;
      height: 100%;
      background-color: rgb(71, 72, 70);
    }
    .custom_right {
      width: 100%;
      height: 100%;
      background-color: rgb(40, 41, 38);
      .custom_sub_left {
        height: 100%;
      }
      .custom_sub_right {
        height: 100%;
      }
    }
  }
</style>