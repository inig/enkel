<template>
  <div class="media_fm">
    <transition name="sideBarShown">
      <div class="media_fm_side_bar_mask"
           @click="hideSideBar"
           v-if="sideBarShown"></div>
    </transition>
    <div class="media_fm_side_bar"
         :class="[sideBarShown ? 'shown' : 'hidden']">
      <div class="media_fm_side_bar_control">
        <div class="current_mood">
          <div class="current_mod_wrapper"
               :style="{backgroundPosition: currentMoodObj.iconNormal}"
               key="current-mood"
               v-if="!activeSource.currentCategory"></div>
          <div class="current_mod_wrapper"
               :style="{backgroundImage: 'url(' + activeSource.icon[0].url + ')', backgroundSize: 'cover'}"
               key="radio"
               :title="activeSource.name"
               v-else-if="activeSource.currentCategory === 'radio'"></div>
        </div>
        <div class="media_fm_side_bar_item"
             v-for="(item, index) in allCategory"
             :key="index"
             :class="[currentCategoryIndex === index ? 'active' : '']"
             @click="chooseCategory(index)">{{item.label}}</div>
      </div>
      <div class="media_fm_content">
        <component :is="allCategory[currentCategoryIndex].name"
                   :all-moods="allMoods"
                   :current-mood="currentMood"
                   @change-mood="changeMood"
                   @play="play"></component>
      </div>
    </div>

    <div class="hidden_video_box"
         id="videoBox">
      <video class="video-js vjs-big-play-centered"
             controls
             preload="auto"
             id="my-player"
             data-setup='{}'
             style="width: 100%; height: 100%;">
        <source id="source"
                :src="activeSource.url"
                :type="activeSource.type">
        </source>
      </video>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
require('video.js/dist/video-js.min.css')
import videojs from 'video.js'
import '@videojs/http-streaming'
export default {
  name: 'MediaFm',
  components: {
    Mood: () => import('./Mood'),
    Radio: () => import('./Radio'),
    Recommend: () => import('./Recommend')
  },
  data () {
    return {
      recommendPageIndex: 1,
      recommendPageSize: 20,
      recommends: [],
      currentRecommendIndex: 0,
      currentMood: '',
      currentMoodObj: {},
      allMoods: [
        {
          label: '烦躁',
          iconNormal: '0 0',
          iconActive: '0 -50px',
          bgColor: '#e7925d'
        },
        {
          label: '悲伤',
          iconNormal: '-50px 0',
          iconActive: '-50px -50px',
          bgColor: '#86c1dc'
        },
        {
          label: '孤独',
          iconNormal: '-100px 0',
          iconActive: '-100px -50px',
          bgColor: '#86c1dc'
        },
        {
          label: '已弃疗',
          iconNormal: '-150px 0',
          iconActive: '-150px -50px',
          bgColor: '#b69bd4'
        },
        {
          label: '减压',
          iconNormal: '-200px 0',
          iconActive: '-200px -50px',
          bgColor: '#92cf67'
        },
        {
          label: '无奈',
          iconNormal: '-250px 0',
          iconActive: '-250px -50px',
          bgColor: '#87c3de'
        },
        {
          label: '快乐',
          iconNormal: '-300px 0',
          iconActive: '-300px -50px',
          bgColor: '#e7925d'
        },
        {
          label: '感动',
          iconNormal: '-350px 0',
          iconActive: '-350px -50px',
          bgColor: '#f47c8c'
        },
        {
          label: '迷茫',
          iconNormal: '-400px 0',
          iconActive: '-400px -50px',
          bgColor: '#e7925d'
        }
      ],
      sideBarShown: true,
      currentCategoryIndex: 0,
      allCategory: [
        {
          label: '广播',
          name: 'radio'
        },
        {
          label: '推荐',
          name: 'recommend'
        },
        {
          label: '心情',
          name: 'mood'
        }
      ],
      fmList: [],
      playBox: {
        status: 'paused', // 播放状态
        data: {}, // 播放数据
        currentIndex: -1 // 当前播放列表索引值
      },
      player: null,
      activeSource: {
        url: '',
        type: 'application/x-mpegURL'
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    let mood = ipcRenderer.sendSync('fm-get-mood')
    next(vm => {
      if (mood) {
        vm.currentMood = mood
        vm.currentMoodObj = vm.allMoods.filter(item => item.label === mood)[0]
      } else {
        vm.currentMood = '烦躁'
        vm.currentMoodObj = {
          label: '烦躁',
          iconNormal: '0 0',
          iconActive: '0 -50px',
          bgColor: '#e7925d'
        }
      }
      vm.getFmListByMood(vm.currentMood)
    })
  },
  methods: {
    hideSideBar () {
      this.sideBarShown = false
    },
    showSideBar () {
      this.sideBarShown = true
    },
    toggleSideBar () {
      this.sideBarShown = !this.sideBarShown
    },
    changeMood (item) {
      this.currentMood = item.label
      this.currentMoodObj = item
    },
    chooseCategory (index) {
      this.currentCategoryIndex = Number(index)
      this.showSideBar()
    },
    getFmListByMood (mood) {
      let res = ipcRenderer.sendSync('fm-get-list-by-mood', {
        mood: mood
      })
      console.log('>>>>>', res)
      if (res.code === 0 && res.data) {
        this.fmList = res.data
      }
    },
    play (data) {
      this.activeSource = data
      this.initPlayer()
    },
    initPlayer () {
      // https://www.awaimai.com/2053.html
      var options = {
        bigPlayButton: true,
        textTrackDisplay: false,
        posterImage: true,
        errorDisplay: false,
        techOrder: ['html5'],
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        preload: 'auto',
        language: 'zh-CN',
        // muted: true
        // poster: 'http://www.ttkzm.com/uploadfile/201912/15/E213231985.jpg'
      }

      this.player = videojs('my-player')
      if (this.player) {
        try {
          this.player.pause()
          this.player.dispose()
        } catch (err) { }
      }

      let videoBox = document.querySelector('#videoBox')
      videoBox.innerHTML = ''
      let videoStr = `<video class="video-js vjs-big-play-centered"
             controls
             preload="auto"
             id="my-player"
             data-setup='{"autoplay": "true"}'
             style="width: 100%; height: 100%;">
        <source id="source"
                src="${this.activeSource.url}"
                type="${this.activeSource.type}">
        </source>
      </video>`
      videoBox.innerHTML = videoStr

      this.player = videojs('my-player', options, function onPlayerReady () {
        this.play()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.media_fm {
  position: relative;
  -webkit-app-region: drag;
  width: 100%;
  height: 100%;
  background-image: url("http://lorempixel.com/1366/768/nature/");
  // background-image: url("https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  .media_fm_side_bar_mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: transparent;
    left: 0;
    top: 0;
  }
  .media_fm_side_bar {
    position: absolute;
    top: 0;
    height: 100%;
    width: 400px;
    background-color: #f0f0f0;
    box-shadow: -1px 0 10px 1px #222629;
    transition: right 0.3s ease-in-out;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    &.hidden {
      right: -300px;
    }
    &.shown {
      right: 0;
    }
    .media_fm_side_bar_control {
      width: 100px;
      height: 100%;
      cursor: pointer;
      background-color: #222629;
      padding: 40px 0;
      box-sizing: border-box;
      .current_mood {
        width: 100%;
        height: 50px;
        margin-bottom: 60px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .current_mod_wrapper {
          width: 50px;
          height: 50px;
          background-color: #fff;
          border-radius: 50%;
          background-image: url("~@/assets/fm_mood_icons.png");
          display: inline-block;
          // pointer-events: none;
        }
      }
      .media_fm_side_bar_item {
        width: 100%;
        height: 48px;
        color: #fff;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        &:hover {
          background-color: #000;
        }
        &.active {
          background-color: #000 !important;
        }
      }
    }
    .media_fm_content {
      width: 300px;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
}
</style>