<template>
  <div class="flac_search">
    <div class="flac_search_header">
      <Input placeholder="搜索歌名/歌手"
             v-model="kw"
             autofocus
             @on-keyup.13="doSearch" />
      <div class="flac_search_header_btn"
           @click="doSearch">搜索</div>
    </div>
    <div class="flac_search_content">
      <div class="flac_search_content_main">
        <div class="flac_search_content_main_header">
          共 {{list.length}} 条结果:
        </div>
        <div class="flac_search_content_main_item"
             v-for="(item, index) in list"
             :key="index"
             :class="[activeIndex === index ? 'active' : '']"
             @click="chooseItem(index, item.url)">
          <transition name="fade">
            <div class="flac_search_content_main_item_loading"
                 v-if="isLoading && (index === activeIndex)">
              <Spin></Spin>
            </div>
          </transition>
          <div class="flac_search_content_main_item_text"
               v-html="(index + 1) + '. ' + item.name"></div>
        </div>
      </div>
      <transition name="fade">
        <div class="flac_search_content_blank"
             v-if="list.length === 0">暂无搜索结果</div>
      </transition>
      <transition name="fade">
        <div class="flac_search_loading"
             v-if="isSearching">
          <Spin size="large"></Spin>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { Icon, Input, Spin } from 'view-design'
export default {
  name: 'MediaFlacSearch',
  components: {
    Icon, Input, Spin
  },
  data () {
    return {
      kw: '',
      isSearching: false,
      list: [],
      activeIndex: -1,
      isLoading: false
    }
  },
  mounted () {
    ipcRenderer.on('flac-response-search', this.searchResponse)
    ipcRenderer.on('flac-response-real-path', this.requesting)
  },
  methods: {
    doSearch () {
      if (!this.kw || !this.kw.trim()) {
        return
      }
      this.isSearching = true
      ipcRenderer.send('flac-search', {
        kw: this.kw
      })
    },
    searchResponse (event, data) {
      this.list = data
      this.isSearching = false
    },
    chooseItem (index, url) {
      this.activeIndex = index
      this.isLoading = true
      ipcRenderer.send('flac-get-real-path', {
        url: url
      })
    },
    requesting () {
      this.isLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.flac_search {
  position: relative;
  // padding-top: 5px;
  width: 100%;
  height: 422px;
  // height: 100%;
  background-color: #f8f8f8;
  overflow: auto;
  &_header {
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: #17191e;
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #c8c8c8;
    font-size: 13px;
    padding-left: 10px;
    border-bottom: 1px solid #222;
    &_btn {
      width: 80px;
      height: 48px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #c8c8c8;
      cursor: pointer;
      background-color: #222;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  &_content {
    position: relative;
    width: 100%;
    height: calc(~"100% - 48px");
    background-color: lightblue;
    overflow-x: hidden;
    overflow-y: auto;
    &_main {
      width: 100%;
      min-height: 100%;
      background-color: #f5f5f5;
      &_header {
        width: 100%;
        height: 48px;
        padding: 0 10px;
        box-sizing: border-box;
        font-size: 13px;
        color: #666;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        border-bottom: 1px solid #eee;
      }
      &_item {
        width: 100%;
        // height: 48px;
        padding: 8px 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        cursor: pointer;
        &.active {
          background-color: #4fc08d !important;
          color: #fff !important;
        }
        &:nth-child(odd) {
          background-color: #eee;
        }
        &:hover {
          background-color: #e8e8e8;
        }
        &_text {
          line-height: 20px;
          font-size: 12px;
          flex: 1;
        }
        &_loading {
          margin-left: -8px;
          margin-right: 8px;
        }
      }
    }
    &_blank {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background-color: #f5f5f5;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #aaa;
    }
  }
  &_loading {
    position: fixed;
    height: calc(~"100% - 250px");
    width: 100%;
    left: 0;
    bottom: 0;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
</style>