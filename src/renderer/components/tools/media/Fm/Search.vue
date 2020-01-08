<template>
  <div class="media_fm_search">
    <div class="media_fm_search_header">
      <Input search
             enter-button
             autofocus
             v-model="filterText"
             placeholder="搜索好声音"
             @on-search="searchFm" />
    </div>
    <div class="media_fm_search_content">
      <div class="media_fm_search_content_item"
           v-for="(item, index) in list"
           :key="index"
           @click="playCurrent(index)">
        <div class="media_fm_search_content_item_left">
          <img :src="item.cover"
               :alt="item.title">
        </div>
        <div class="media_fm_search_content_item_right">
          <div class="media_fm_search_content_item_right_title"
               v-html="filterLabel(item.title, filterText)"></div>
          <div class="media_fm_search_content_item_right_item">主播: <span v-html="filterLabel(item.speak, filterText)"></span></div>
          <div class="media_fm_search_content_item_right_item">收藏: {{item.favnum}}</div>
        </div>
      </div>
      <div class="media_fm_anchor_detail_loadmore"
           v-if="!noMoreList && list.length > 0"
           @click="loadNextPage">
        <svg v-if="loadingMoreList">
          <use xlink:href="#loading"></use>
        </svg>
        <span v-else>加载更多</span>
      </div>
      <div class="media_fm_anchor_detail_end"
           v-if="noMoreList">
        已经看完了
      </div>
      <div class="media_fm_search_empty"
           v-if="list.length === 0">
        暂无搜索结果
      </div>
    </div>
  </div>
</template>

<script>
import { Input } from 'view-design'
import { ipcRenderer } from 'electron'
export default {
  name: 'MediaFmSearch',
  components: {
    Input
  },
  data () {
    return {
      filterText: '',
      noMoreList: false,
      loadingMoreList: false,
      list: [],
      pageIndex: 1,
      pageSize: 20 // 搜索最多20条
    }
  },
  computed: {
    filterLabel () {
      return function (text, filter) {
        let outHtml = ''
        let reg = new RegExp(filter, 'ig')
        outHtml = text.replace(reg, item => '<span class="emphasize2">' + item + '</span>')
        return outHtml
      }
    }
  },
  methods: {
    searchFm () {
      let content = document.querySelector('.media_fm_search_content')
      content && (content.scrollTop = 0)
      this.resetSearchCondition()
      this.search()
    },
    search () {
      if (!this.filterText || !this.filterText.trim()) {
        return
      }

      let res = ipcRenderer.sendSync('fm-search', {
        key: this.filterText.trim(),
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
      if (res.code === 0 && res.data && res.data.length > 0) {
        if (this.pageIndex === 1) {
          this.list = res.data || []
        } else {
          this.list = this.list.concat(res.data || [])
        }
        if (res.data.length < this.pageSize) {
          this.noMoreList = true
        } else {
          this.noMoreList = false
        }
      } else {
        this.noMoreList = true
      }
    },
    resetSearchCondition () {
      this.pageIndex = 1
      this.list = []
    },
    loadNextPage () {
      this.pageIndex += 1
      this.search()
    },
    playCurrent (index) {
      this.$emit('play-list', {
        moodItem: {},
        list: [this.list[Number(index)]],
        type: 'audio/mp3'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.media_fm_search {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .media_fm_search_header {
    width: 100%;
    height: 90px;
    padding: 43px 15px 15px 15px;
    box-sizing: border-box;
    background-color: #222629;
    color: #ffffff;
    border-left: 1px solid #000;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .media_fm_search_content {
    width: 100%;
    height: calc(~"100% - 90px");
    padding: 8px 0;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    .media_fm_search_content_item {
      width: 100%;
      height: 106px;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding-top: 8px;
      padding-bottom: 8px;
      box-sizing: border-box;
      &:hover {
        background-color: rgba(25, 28, 31, 0.05) !important;
      }
      .media_fm_search_content_item_left {
        width: 70px;
        height: 70px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        img {
          width: 70px;
          height: 70px;
        }
      }
      .media_fm_search_content_item_right {
        width: 180px;
        height: 90px;
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .media_fm_search_content_item_right_title {
          width: 100%;
          max-height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          color: #222629;
          font-size: 14px;
        }
        .media_fm_search_content_item_right_item {
          width: 100%;
          height: 20px;
          color: #787a7c;
          font-size: 13px;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      }
    }
    .media_fm_anchor_detail_loadmore {
      width: 100%;
      height: 48px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.5);
      transition: color 0.2s ease-in-out;
      &:hover {
        color: rgba(0, 0, 0, 0.7);
      }
      svg {
        width: 30px;
        height: 30px;
      }
    }
    .media_fm_anchor_detail_end {
      width: 100%;
      height: 48px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.5);
    }
  }
  .media_fm_search_empty {
    width: 100%;
    height: calc(~"100% - 90px");
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: #999;
  }
}
</style>