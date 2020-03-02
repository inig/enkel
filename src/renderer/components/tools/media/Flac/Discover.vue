<template>
  <div class="flac_discover">
    <div class="flac_discover_top">
      <Tabs :value="list.length ? list[0].group : ''">
        <TabPane v-for="(item, index) in list.slice(0, 3)"
                 :key="index"
                 :label="item.group"
                 :name="item.group">
          <div class="flac_discover_item"
               v-for="(itm, idx) in item.list"
               :key="idx"
               :class="[(activeIndex[0] === index) && (activeIndex[1] === idx) ? 'active' : '']"
               @click="chooseItem(index, idx, 0, itm.url)">
            <transition name="fade">
              <div class="flac_discover_item_loading"
                   v-if="(activeIndex[0] === index) && (activeIndex[1] === idx) && isLoading">
                <Spin></Spin>
              </div>
            </transition>
            <div class="flac_discover_item_text"
                 :style="{width: ((activeIndex[0] === index) && (activeIndex[1] === idx) && isLoading) ? 'calc(100% - 25px)' : '100%'}">
              {{itm.name}}
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
    <div class="flac_discover_category"
         v-for="(item, index) in list.slice(3)"
         :key="index">
      <div class="flac_discover_category_title">
        <div class="flac_discover_category_title_text">{{item.group}}</div>
      </div>
      <div class="flac_discover_category_content">
        <div class="flac_discover_item"
             v-for="(itm, idx) in item.list"
             :key="idx"
             :class="[(activeIndex[0] === index + 3) && (activeIndex[1] === idx) ? 'active' : '']"
             @click="chooseItem(index, idx, 3, itm.url)">
          <transition name="fade">
            <div class="flac_discover_item_loading"
                 v-if="(activeIndex[0] === index + 3) && (activeIndex[1] === idx) && isLoading">
              <Spin></Spin>
            </div>
          </transition>
          <div class="flac_discover_item_text"
               :style="{width: ((activeIndex[0] === index + 3) && (activeIndex[1] === idx) && isLoading) ? 'calc(100% - 25px)' : '100%'}">
            {{itm.name}}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import { Tabs, TabPane, Spin } from 'view-design'
  export default {
    name: 'MediaFlacDiscover',
    components: {
      Tabs, TabPane, Spin
    },
    data () {
      return {
        list: [],
        isLoading: false,
        requestingTimeout: null,
        activeIndex: [-1, -1]
      }
    },
    created () {
      console.log('created')
    },
    mounted () {
      ipcRenderer.on('flac-response-get-play-list', this.initData)
      ipcRenderer.on('flac-response-real-path', this.requesting)
    },
    methods: {
      initData (event, list) {
        this.list = list
      },
      chooseItem (mainIndex, index, offset, url) {
        this.activeIndex = [mainIndex + offset, index]
        this.isLoading = true

        // if (!this.requestingTimeout) {
        //   this.requestingTimeout = setTimeout(() => {
        //     this.isLoading = false
        //     clearTimeout(this.requestingTimeout)
        //   }, 60 * 1000)
        // }

        ipcRenderer.send('flac-get-real-path', {
          url: url
        })
      },
      requesting (event, data) {
        this.isLoading = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .flac_discover {
    position: relative;
    padding-top: 5px;
    width: 100%;
    height: 422px;
    // height: 100%;
    background-color: #f8f8f8;
    padding-top: 5px;
    overflow: auto;
    &_item {
      position: relative;
      width: 100%;
      height: 32px;
      cursor: pointer;

      font-size: 12px;
      color: #555;
      line-height: 32px;
      padding: 0 15px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      &:nth-child(odd) {
        background-color: #f0f0f0;
      }
      &:hover {
        background-color: #e8e8e8;
      }
      &_loading {
        margin-right: 5px;
        display: inline-block;
      }
      &.active {
        background-color: #4fc08d;
        color: #fff;
      }
      &_text {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    &_top {
      width: 100%;
    }
    &_category {
      width: 100%;
      margin-top: 15px;
      margin-top: 15px;
      &_title {
        width: 100%;
        height: 32px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 0 15px;
        box-sizing: border-box;
        &_text {
          font-size: 13px;
          color: #222;
          height: 32px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          border-bottom: 2px solid #4fc08d;
        }
      }
      &_content {
        margin-top: 15px;
      }
    }
  }
</style>