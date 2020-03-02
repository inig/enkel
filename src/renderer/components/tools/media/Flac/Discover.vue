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
    <transition name="fade">
      <div class="flac_discover_loading"
           v-if="!pageLoaded">
        <img src="~@/assets/images/flac/loading.gif"
             alt="加载中">
      </div>
    </transition>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { Tabs, TabPane, Spin, Input } from 'view-design'
export default {
  name: 'MediaFlacDiscover',
  components: {
    Tabs, TabPane, Spin, Input
  },
  props: {
    shown: {
      type: Boolean
    }
  },
  data () {
    return {
      list: [],
      isLoading: false,
      requestingTimeout: null,
      activeIndex: [-1, -1],
      kw: '',
      pageLoaded: false
    }
  },
  created () {
    this.pageLoaded = false
  },
  mounted () {
    ipcRenderer.on('flac-response-get-play-list', this.initData)
    ipcRenderer.on('flac-response-real-path', this.requesting)
  },
  methods: {
    initData (event, list) {
      this.list = list
      this.$nextTick(() => {
        this.pageLoaded = true
      })
    },
    chooseItem (mainIndex, index, offset, url) {
      this.activeIndex = [mainIndex + offset, index]
      this.isLoading = true

      ipcRenderer.send('flac-get-real-path', {
        url: url
      })
    },
    requesting (event, data) {
      this.isLoading = false
    }
  },
  watch: {
    shown (val) {
      if (!val) {
        this.activeIndex = [-1, -1]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.flac_discover {
  position: relative;
  // padding-top: 5px;
  width: 100%;
  height: 422px;
  // height: 100%;
  background-color: #f8f8f8;
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
        border-bottom: 2px solid #2e2f2b;
      }
    }
    &_content {
      margin-top: 15px;
    }
  }
  &_loading {
    position: fixed;
    height: calc(~"100% - 250px");
    width: 100%;
    left: 0;
    bottom: 0;
    background-color: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    z-index: 9;
  }
}
</style>