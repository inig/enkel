<template>
  <div class="play_list">
    <div class="play_list_header">播放列表（{{playList.length}}）</div>
    <div class="play_list_content">
      <div class="play_list_content_item"
           v-for="(item, index) in playList"
           :key="index"
           :class="[index === activeIndex ?  'active' : '']"
           :style="{position: (index === activeIndex) ? 'sticky' : 'static'}"
           @click="changeActiveIndex(index)">
        <div class="play_list_content_item_left"
             :style="{width: (index === activeIndex) ? 'calc(100% - 48px)' : '100%'}">
          <div class="play_list_content_item_left_name">{{index + 1}}. {{playList[index].name}}</div>
          <div class="play_list_content_item_left_artist"
               :style="{paddingRight: (index === activeIndex) ? '0px' : '15px'}">{{playList[index].artist}}</div>
        </div>
        <transition name="fade">
          <div class="play_list_content_item_right"
               v-if="index === activeIndex">
            <Icon type="ios-pause"
                  color="#fff"
                  size="18" />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'view-design'
export default {
  name: 'MediaFlacList',
  components: {
    Icon
  },
  props: {
    playList: {
      type: Array,
      default () {
        return []
      }
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    changeActiveIndex (index) {
      this.$emit('change-active-index', index)
    }
  }
}
</script>

<style lang="less" scoped>
.play_list {
  position: relative;
  padding-top: 5px;
  width: 100%;
  height: 422px;
  // height: 100%;
  background-color: #17191e;
  padding-top: 5px;
  overflow: auto;
  &_header {
    position: sticky;
    top: 0;
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
  }
  &_content {
    width: 100%;
    // padding: 10px;
    &_item {
      width: 100%;
      height: 48px;
      top: 48px;
      cursor: pointer;
      border-bottom: 1px solid #222;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      &:hover {
        &:nth-child(odd) {
          background-color: #17191e;
        }
        &:nth-child(even) {
          background-color: #17191e;
        }
      }
      &:nth-child(odd) {
        background-color: #111;
      }
      &:nth-child(even) {
        background-color: #111;
      }
      &.active {
        background-color: #17191e;
      }
      &_left {
        // flex: 1;
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        transition: all 0.3s ease-in-out;
        &_name {
          width: calc(~"100% - 110px");
          height: 48px;
          line-height: 48px;
          padding-left: 15px;
          box-sizing: border-box;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #c8c8c8;
        }
        &_artist {
          width: 110px;
          height: 48px;
          line-height: 48px;
          padding-left: 10px;
          box-sizing: border-box;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #888;
          text-align: right;
        }
      }
      &_right {
        width: 48px;
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>