<template>
  <div class="media_fm_anchor">
    <div class="media_fm_anchor_header">发现主播</div>
    <div class="media_fm_anchor_content">
      <vue-waterfall-easy ref="waterfall"
                          :imgsArr="anchors"
                          @scrollReachBottom="getAchorList"
                          srcKey="cover"
                          :imgWidth="80"
                          :gap="13"
                          :maxCols="3"
                          :loadingDotStyle="{backgroundColor: '#222629'}"
                          @click="gotoAnchorDetail"
                          @imgError="imgLoadError">
        <div class="img-info"
             slot-scope="props">
          <p class="anchor_name">{{props.value.title}}</p>
        </div>
      </vue-waterfall-easy>
    </div>

    <div class="media_fm_anchor_detail_panel"
         :class="[anchorDetailShown ? 'shown' : 'hidden']">
      <div class="media_fm_anchor_detail_panel_header">
        <div class="media_fm_anchor_detail_panel_header_avatar">
          <img :src="currentAnchor.cover"
               :alt="currentAnchor.title">
        </div>
        <div class="media_fm_anchor_detail_panel_header_name">{{currentAnchor.title}}</div>
        <div class="media_fm_anchor_detail_panel_header_back"
             @click="hideAnchorDetailPanel">
          <svg>
            <use xlink:href="#back"></use>
          </svg>
        </div>
        <div class="media_fm_anchor_favorite"
             title="关注主播"
             :class="[favorite['anchor'].some(item => item.id === currentAnchor.id) ? 'favorited' : '']"
             @click="toggleFavorite('anchor')">
          <svg>
            <use xlink:href="#favorite"></use>
          </svg>
        </div>
      </div>
      <div class="media_fm_anchor_detail_panel_tab">
        <div class="media_fm_anchor_detail_panel_tab_item">节目（{{currentAnchor.fmnum || 0}}）</div>
        <div class="media_fm_anchor_detail_panel_tab_playall"
             @click="playList">播放全部</div>
      </div>
      <div class="media_fm_anchor_detail_panel_content">
        <div class="media_fm_anchor_detail_panel_content_item"
             v-for="(item, index) in detailList"
             :key="index"
             @click="playCurrent(index)">
          <div class="media_fm_anchor_detail_panel_content_item_left">
            <img :src="item.cover"
                 :alt="item.title">
          </div>
          <div class="media_fm_anchor_detail_panel_content_item_right">
            <div class="media_fm_anchor_detail_panel_content_item_right_title">{{item.title}}</div>
            <div class="media_fm_anchor_detail_panel_content_item_right_item">主播: {{item.speak}}</div>
            <div class="media_fm_anchor_detail_panel_content_item_right_item">收藏: {{item.favnum}}</div>
          </div>
        </div>
        <div class="media_fm_anchor_detail_loadmore"
             v-if="!noMoreDetail"
             @click="getAnchorDetailList">
          <svg v-if="loadingMoreDetail">
            <use xlink:href="#loading"></use>
          </svg>
          <span v-else>加载更多</span>
        </div>
        <div class="media_fm_anchor_detail_end"
             v-if="noMoreDetail">
          已经看完了
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'MediaFmAnchor',
  components: {
    vueWaterfallEasy: () => import('vue-waterfall-easy')
  },
  props: {
    favorite: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 30,
      anchors: [],
      anchorDetailShown: false,
      detailIndex: 1,
      detailSize: 20,
      noMoreDetail: false,
      loadingMoreDetail: false, // 正在加载
      detailList: [],
      currentAnchor: {}
    }
  },
  created () {
    this.getAchorList()
  },
  mounted () {
    global.eventHub.$on('go-to-anchor-detail', this.redirectToAnchorDetail)
    global.eventHub.$on('reset-anchor-detail-panel', this.hideAnchorDetailPanel)
  },
  methods: {
    getAchorList () {
      let res = ipcRenderer.sendSync('fm-get-anchor-list', {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
      if (res.code === 0 && res.data && res.data.length > 0) {
        if (this.pageIndex === 1) {
          this.anchors = res.data || []
        } else {
          this.anchors = this.anchors.concat(res.data || [])
        }
        this.pageIndex = Number(res.pageIndex) + 1
        if (res.data.length < this.pageSize) {
          this.$refs.waterfall.waterfallOver()
        }
      } else {
        this.$refs.waterfall.waterfallOver()
      }
    },
    showAnchorDetailPanel () {
      this.anchorDetailShown = true
    },
    hideAnchorDetailPanel () {
      this.anchorDetailShown = false
    },
    gotoAnchorDetail (event, data) {
      this.currentAnchor = data.value
      this.showAnchorDetailPanel()
      this.resetDetailInfo()
      this.getAnchorDetailList()
      document.querySelector('.media_fm_anchor_detail_panel_content').scrollTop = 0
    },
    redirectToAnchorDetail (data) {
      this.gotoAnchorDetail(null, {
        value: data
      })
    },
    imgLoadError (r) {
      console.log('....', r)
    },
    resetDetailInfo () {
      this.detailIndex = 1
      this.loadingMoreDetail = false
    },
    getAnchorDetailList () {
      if (this.loadingMoreDetail) {
        return
      }
      this.loadingMoreDetail = true
      let res = ipcRenderer.sendSync('fm-get-anchor-playlist', {
        anchorId: this.currentAnchor.id,
        pageIndex: this.detailIndex,
        pageSize: this.detailSize
      })
      if (res.code === 0 && res.data && res.data.length > 0) {
        if (this.detailIndex === 1) {
          this.detailList = res.data || []
        } else {
          this.detailList = this.detailList.concat(res.data || [])
        }
        this.detailIndex = Number(res.pageIndex) + 1
        if (res.data.length < this.detailSize) {
          this.noMoreDetail = true
        } else {
          this.noMoreDetail = false
        }
      } else {
        this.noMoreDetail = true
      }
      this.loadingMoreDetail = false
    },
    playList () {
      this.$emit('play-list', {
        moodItem: {},
        list: this.detailList,
        type: 'audio/mp3'
      })
    },
    playCurrent (index) {
      this.$emit('play-list', {
        moodItem: {},
        list: [this.detailList[Number(index)]],
        type: 'audio/mp3'
      })
    },
    toggleFavorite (type) {
      if (this.favorite[type].some(item => item.id === this.currentAnchor.id)) {
        this.$emit('remove-favorite', {
          type: type,
          data: this.currentAnchor
        })
      } else {
        this.$emit('set-favorite', {
          type: type,
          data: this.currentAnchor
        })
      }
    }
  }
}
</script>

<style lang="less">
.media_fm_anchor {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .media_fm_anchor_header {
    width: 100%;
    height: 42px;
    background-color: #222629;
    color: #ffffff;
    border-left: 1px solid #000;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .media_fm_anchor_content {
    width: 100%;
    height: calc(~"100% - 42px");
    padding: 8px 10px 10px 10px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    .anchor_name {
      text-align: center;
      color: #666;
      font-size: 13px;
      padding: 4px 0;
      box-sizing: border-box;
    }
    .img-wraper {
      overflow: hidden;
      img {
        transition: transform 0.2s ease-in-out;
        transform: scale(1);
      }
      &:hover {
        img {
          transform: scale(1.2);
        }
      }
    }
  }
  .media_fm_anchor_detail_panel {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    background-color: #f0f0f0;
    transition: left 0.3s ease-in-out;
    transition-delay: 300ms;
    &.shown {
      left: 0;
    }
    &.hidden {
      left: 100%;
    }
    .media_fm_anchor_detail_panel_header {
      position: relative;
      width: 100%;
      height: 170px;
      background-color: #191c1f;
      padding-top: 25px;
      box-sizing: border-box;
      .media_fm_anchor_detail_panel_header_avatar {
        width: 100%;
        height: 100px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        img {
          width: 100px;
          height: 100px;
          border-radius: 50px;
          overflow: hidden;
          cursor: pointer;
          transition: opacity 0.2s ease-in-out;
          opacity: 1;
          &:hover {
            opacity: 0.7;
          }
        }
      }
      .media_fm_anchor_detail_panel_header_name {
        width: 100%;
        height: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        margin-top: 5px;
      }
      .media_fm_anchor_detail_panel_header_back {
        position: absolute;
        width: 36px;
        height: 36px;
        left: 15px;
        top: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 1;
        transition: opacity 0.2s ease-in-out;
        &:hover {
          opacity: 0.7;
        }
        svg {
          width: 16px;
          height: 16px;
          fill: #f0f0f0;
        }
      }
      .media_fm_anchor_favorite {
        position: absolute;
        width: 20px;
        height: 20px;
        right: 20px;
        top: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        svg {
          width: 18px;
          height: 18px;
          fill: #888;
          transition: fill 0.3s ease-in-out;
        }
        &:hover {
          svg {
            fill: red;
          }
        }
        &.favorited {
          svg {
            fill: red !important;
          }
        }
      }
    }
    .media_fm_anchor_detail_panel_tab {
      position: relative;
      width: 100%;
      height: 48px;
      background-color: #191c1f;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .media_fm_anchor_detail_panel_tab_item {
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        opacity: 1;
        transition: opacity 0.2s ease-in-out;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
      .media_fm_anchor_detail_panel_tab_playall {
        height: 48px;
        padding: 0 8px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: #fff;
        margin-right: 15px;
        font-size: 13px;
        cursor: pointer;
      }
    }
    .media_fm_anchor_detail_panel_content {
      width: 100%;
      height: calc(~"100% - 218px");
      padding: 8px 0;
      box-sizing: border-box;
      overflow-y: auto;
      overflow-x: hidden;
      .media_fm_anchor_detail_panel_content_item {
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
        .media_fm_anchor_detail_panel_content_item_left {
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
        .media_fm_anchor_detail_panel_content_item_right {
          width: 180px;
          height: 90px;
          margin-left: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .media_fm_anchor_detail_panel_content_item_right_title {
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
          .media_fm_anchor_detail_panel_content_item_right_item {
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
  }
}
</style>