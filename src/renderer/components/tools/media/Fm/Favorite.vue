<template>
  <div class="media_fm_recommend">
    <div class="media_fm_favorite_header">我的最爱</div>
    <div class="media_fm_favorite_content">
      <Tabs :value="currentFavoriteType">
        <TabPane v-for="(item, index) in favoriteType"
                 :key="index"
                 :label="item.label"
                 :name="item.name">
          <div class="favorite_panel_item favorite_radio"
               v-if="'radio' === item.name">
            <div class="media_fm_radio_channel_item"
                 v-for="(itm, index) in favorite[item.name]"
                 :key="index"
                 :title="itm.name">
              <div class="media_fm_radio_channel_item_inner"
                   @click="play(item.name, itm)">
                <img :src="itm.icon[0].url"
                     :alt="itm.name">
              </div>
            </div>
          </div>
          <div class="favorite_panel_item favorite_sound"
               v-if="'sound' === item.name">
            <div class="media_fm_radio_channel_item"
                 v-for="(itm, index) in favorite[item.name]"
                 :key="index"
                 :title="itm.title">
              <div class="media_fm_radio_channel_item_inner"
                   @click="play(item.name, itm)">
                <img :src="itm.cover"
                     :alt="itm.title">
              </div>
            </div>
          </div>
          <div class="favorite_panel_item favorite_anchor"
               v-if="'anchor' === item.name">
            <div class="media_fm_radio_channel_item"
                 v-for="(itm, index) in favorite[item.name]"
                 :key="index"
                 :title="itm.title">
              <div class="media_fm_radio_channel_item_inner media_fm_radio_channel_item_anchor"
                   @click="gotoAnchorDetail(itm)">
                <img :src="itm.cover"
                     :alt="itm.title">
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { Tabs, TabPane } from 'view-design'
export default {
  name: 'MediaFmFavorite',
  components: {
    Tabs, TabPane
  },
  props: {
    favorite: {
      type: Object,
      default () {
        return {
          radio: [],
          sound: [],
          anchor: []
        }
      }
    }
  },
  data () {
    return {
      favoriteType: [
        {
          label: '电台',
          name: 'radio'
        },
        {
          label: '声音',
          name: 'sound'
        },
        {
          label: '主播',
          name: 'anchor'
        }
      ],
      currentFavoriteType: 'radio'
    }
  },
  created () {
  },
  methods: {
    play (name, item) {
      this.$emit('play', Object.assign({ currentCategory: name }, item))
    },
    gotoAnchorDetail (data) {
      global.eventHub.$emit('open-anchor-detail-panel', {
        page: 'detail',
        data: data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.media_fm_recommend {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .media_fm_favorite_header {
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
  .media_fm_favorite_content {
    width: 100%;
    height: calc(~"100% - 42px");
    overflow-x: hidden;
    overflow-y: auto;
    padding: 15px;
    box-sizing: border-box;
    // display: flex;
    // flex-direction: row;
    // flex-wrap: wrap;
    // align-items: center;
    // justify-content: center;
  }
  .favorite_panel_item {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .media_fm_radio_channel_item {
    width: 50%;
    height: 135px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .media_fm_radio_channel_item_inner {
      width: 120px;
      height: 120px;
      background-color: #fff;
      cursor: pointer;
      &.media_fm_radio_channel_item_anchor {
        border: 1px solid #c8c8c8;
        border-radius: 50%;
        overflow: hidden;
        &:hover {
          img {
            transform: scale(1.2);
          }
        }
      }
      img {
        width: 120px;
        height: 120px;
        transform: scale(1);
        transition: transform 0.3s ease-in-out;
      }
    }
  }
}
</style>