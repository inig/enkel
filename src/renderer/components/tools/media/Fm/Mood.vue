<template>
  <div class="media_fm_mood">
    <div class="media_fm_mood_header">选择心情</div>
    <div class="media_fm_mood_content">
      <div class="media_fm_item"
           v-for="(item, index) in allMoods"
           :key="index">
        <div class="media_fm_item_inner"
             :style="{backgroundColor: currentMood === item.label ? item.bgColor : '#FFF'}"
             @mouseenter="hoverFmMoodItem($event, item)"
             @mouseout="hoverOutFmMoodItem($event, item)"
             @click="chooseFmMood($event, item)">
          <a href="javascript:void(0)"
             :style="{backgroundPosition: (currentMood === item.label ? item.iconActive : item.iconNormal)}"></a>
          <span :style="{color: (currentMood === item.label ? '#fff' : '#333')}">{{item.label}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'MediaFmMood',
  props: {
    allMoods: {
      type: Array,
      default () {
        return []
      }
    },
    currentMood: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  methods: {
    hoverFmMoodItem (event, item) {
      if (this.currentMood === item.label) {
        return
      }
      event.target.style.backgroundColor = item.bgColor
      event.target.children[0].style.backgroundPosition = item.iconActive
      event.target.children[1].style.color = '#fff'
    },
    hoverOutFmMoodItem (event, item) {
      if (this.currentMood === item.label) {
        return
      }
      event.target.style.backgroundColor = '#fff'
      event.target.children[0].style.backgroundPosition = item.iconNormal
      event.target.children[1].style.color = '#333'
    },
    getFmListByMood (mood) {
      let res = ipcRenderer.sendSync('fm-get-list-by-mood', {
        mood: mood,
        pageIndex: Math.ceil(Math.random() * 100),
        pageSize: 20
      })
      return res.data || []
    },
    chooseFmMood (event, item) {
      if (this.currentMood === item.label) {
        return
      }
      // this.currentMood = item.label
      let list = this.getFmListByMood(item.label)
      this.$emit('play-list', {
        moodItem: item,
        list: list,
        type: 'audio/mp3'
      })
      // this.$emit('change-mood', item)
    },
  }
}
</script>

<style lang="less" scoped>
.media_fm_mood {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .media_fm_mood_header {
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
  .media_fm_mood_content {
    width: 100%;
    max-height: calc(~"100% - 42px");
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .media_fm_item {
      position: relative;
      width: 50%;
      height: 140px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      &.empty {
        height: 0;
      }
      .media_fm_item_inner {
        position: relative;
        width: calc(~"100% - 20px");
        height: 120px;
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        // transition: background-color 0.2s ease-in-out;
        a {
          width: 50px;
          height: 50px;
          background-image: url("~@/assets/fm_mood_icons.png");
          display: inline-block;
          pointer-events: none;
        }
        span {
          position: absolute;
          bottom: 10px;
          font-size: 13px;
          pointer-events: none;
          background-color: transparent;
        }
      }
    }
  }
}
</style>