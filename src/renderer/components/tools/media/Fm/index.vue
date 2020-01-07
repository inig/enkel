<template>
  <div class="media_fm"
       :style="{backgroundImage: 'url(' + bg + ')'}">
    <transition name="sideBarShown">
      <div class="media_fm_side_bar_mask"
           @click="hideSideBar"
           v-if="sideBarShown"></div>
    </transition>
    <div class="media_fm_side_bar"
         :class="[sideBarShown ? 'shown' : 'hidden']">
      <div class="media_fm_side_bar_control">
        <div class="current_mood"
             @click="toggleSideBar">
          <div class="current_mood_wrapper"
               :style="{backgroundImage: 'url(' + activeSource.cover + ')', backgroundSize: 'cover'}"
               v-if="activeSource.cover">
            <!-- <img :src="activeSource.cover"
                 alt=""> -->
          </div>
          <div class="current_mood_wrapper"
               :style="{backgroundPosition: currentMoodObj.iconNormal}"
               key="current-mood"
               v-else-if="!activeSource.currentCategory"></div>
          <div class="current_mood_wrapper"
               :style="{backgroundImage: 'url(' + activeSource.icon[0].url + ')', backgroundSize: 'cover'}"
               key="radio"
               :title="activeSource.name"
               v-else-if="activeSource.currentCategory === 'radio'"></div>

        </div>
        <div class="media_fm_side_bar_favorite"
             @click="openFavoritePanel">
          <svg>
            <use xlink:href="#favorite"></use>
          </svg>
        </div>
        <div class="media_fm_side_bar_item"
             v-for="(item, index) in allCategory"
             :key="index"
             :class="[currentCategoryIndex === index ? 'active' : '']"
             @click="chooseCategory(index)">{{item.label}}</div>
        <div class="media_fm_side_bar_settings"
             @click="showSettingsModal">
          <Icon type="ios-cog"
                color="#fff"
                size="24" />
        </div>
      </div>
      <div class="media_fm_content">
        <keep-alive>
          <component :is="currentCategoryIndex > -1 ? allCategory[currentCategoryIndex].name : additionalPanel"
                     :all-moods="allMoods"
                     :current-mood="currentMood"
                     :favorite="favorite"
                     @play-list="playList"
                     @play="play"></component>
        </keep-alive>
      </div>
    </div>

    <div class="hidden_video_box"
         style="pointer-events: none; opacity: 0;"
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

    <div class="play_box">
      <div class="play_box_mood"
           v-if="playBox.category === 'mood'">
        <h2>{{activeSource.title}}</h2>
        <h4>主播: {{activeSource.speak}}</h4>
        <div class="play_box_mood_control">
          <div class="play_box_mood_control_item small play_box_mood_control_prev"
               @click="playPrev">
            <Icon type="ios-skip-backward"
                  color="#fff"
                  size="20" />
          </div>
          <div class="play_box_mood_control_item big paly_box_mood_control_play"
               v-if="playBox.status === 'pause'"
               @click="setPlayStatus('play')">
            <Icon type="ios-play"
                  color="#fff"
                  size="28" />
          </div>
          <div class="play_box_mood_control_item big paly_box_mood_control_pause"
               v-if="playBox.status === 'play'"
               @click="setPlayStatus('pause')">
            <Icon type="ios-pause"
                  color="#fff"
                  size="28" />
          </div>
          <div class="play_box_mood_control_item small paly_box_mood_control_next"
               @click="playNext">
            <Icon type="ios-skip-forward"
                  color="#fff"
                  size="20" />
          </div>

          <div class="play_box_mood_control_progress">
            <Slider :value="playBox.currentTime"
                    :max="playBox.duration"
                    :tip-format="(value) => $timeFilter(value)"
                    @on-change="changeCurrentTime"></Slider>
          </div>
          <div class="play_box_mood_control_progress_tip">{{(playBox.duration - playBox.currentTime) | timeFilter}}</div>
        </div>
        <div class="play_box_heart"
             :class="[favorite['sound'].some(item => item.url === activeSource.url) ? 'favorited' : '']"
             @click="toggleFavorite('sound')">
          <svg>
            <use xlink:href="#favorite"></use>
          </svg>
        </div>
      </div>
      <div class="play_box_radio"
           v-if="playBox.category === 'radio'">
        <img :src="activeSource.icon[0].url"
             :alt="activeSource.name">
        <div class="play_box_radio_btn"
             v-if="playBox.status === 'pause'"
             @click="setPlayStatus('play')">
          <Icon type="ios-play"
                color="#fff"
                size="28" />
        </div>
        <div class="play_box_radio_btn"
             v-if="playBox.status === 'play'"
             @click="setPlayStatus('pause')">
          <Icon type="ios-pause"
                color="#fff"
                size="28" />
        </div>
        <div class="play_box_radio_name">{{activeSource.name}}</div>
        <div class="play_box_heart"
             :class="[favorite['radio'].some(item => item.url === activeSource.url) ? 'favorited' : '']"
             @click="toggleFavorite('radio')">
          <svg>
            <use xlink:href="#favorite"></use>
          </svg>
        </div>
      </div>
    </div>

    <div class="logo_box">
      <div class="logo_box_title">Enkel FM</div>
      <div class="logo_box_slogan">听各种心情</div>
    </div>

    <Modal v-model="settings.shown"
           width="400"
           title="设置"
           ok-text="保存"
           @on-ok="saveSettings">
      <div class="settings_modal_item">
        <div class="settings_modal_item_label">背景图片</div>
        <div class="settings_modal_item_value">
          <Input placeholder="输入背景图片"
                 type="text"
                 clearable
                 v-model="settings.bg" />
        </div>
      </div>
      <div class="settings_modal_item">
        <div class="settings_modal_item_label"></div>
        <div class="settings_modal_item_value">
          <div class="settings_modal_item_previewer">
            <img :src="settings.bg">
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { Icon, Slider, Modal, Input } from 'view-design'
require('video.js/dist/video-js.min.css')
import videojs from 'video.js'
import '@videojs/http-streaming'
export default {
  name: 'MediaFm',
  components: {
    Mood: () => import('./Mood'),
    Radio: () => import('./Radio'),
    Recommend: () => import('./Recommend'),
    Anchor: () => import('./Anchor'),
    Favorite: () => import('./Favorite'),
    Icon, Slider, Modal, Input
  },
  data () {
    return {
      bg: '',
      settings: {
        shown: false,
        bg: 'http://e.hiphotos.baidu.com/zhidao/pic/item/ae51f3deb48f8c5420d92dbf38292df5e0fe7f1c.jpg'
      },
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
      currentCategoryIndex: 1,
      allCategory: [
        {
          label: '广播',
          name: 'radio'
        },
        {
          label: '主播',
          name: 'anchor'
        },
        {
          label: '心情',
          name: 'mood'
        }
      ],
      fmList: [],
      playBox: {
        status: 'pause', // 播放状态
        data: {}, // 播放数据
        currentIndex: 0, // 当前播放列表索引值
        category: 'mood',
        duration: 0,
        currentTime: 0
      },
      player: null,
      activeSource: {
        url: '',
        type: 'application/x-mpegURL'
      },
      additionalPanel: '',
      favorite: {}
    }
  },
  beforeRouteEnter (to, from, next) {
    let mood = ipcRenderer.sendSync('fm-get-mood')
    let bg = ipcRenderer.sendSync('fm-get-bg')
    next(vm => {
      vm.bg = bg
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
    })
  },
  created () {
    this.getFavoriteFmList()
  },
  mounted () {
    this.getFmListByMood(this.currentMood)
    this.playBox.currentIndex = 0
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
    playList (data) {
      if (data.moodItem.label) {
        this.currentMood = data.moodItem.label
        this.currentMoodObj = data.moodItem
      }
      this.activeSource = Object.assign({}, data.list[0], {
        type: data.type
      })
      this.playBox.currentIndex = this.fmList.length
      this.fmList = this.fmList.concat(data.list)
      this.playBox.category = 'mood'
      this.initPlayer()
    },
    chooseCategory (index) {
      this.additionalPanel = ''
      this.currentCategoryIndex = Number(index)
      this.showSideBar()
    },
    openFavoritePanel () {
      this.additionalPanel = 'favorite'
      this.currentCategoryIndex = -1
      this.showSideBar()
    },
    getFmListByMood (mood) {
      let res = ipcRenderer.sendSync('fm-get-list-by-mood', {
        mood: mood,
        pageIndex: Math.ceil(Math.random() * 100),
        pageSize: 20
      })
      if (res.code === 0 && res.data) {
        let lastIndex
        if (this.fmList.length > 0) {
          lastIndex = this.fmList.length
          this.fmList = this.fmList.concat(res.data)
        } else {
          lastIndex = 0
          this.fmList = res.data
        }
        this.playBox.currentIndex = lastIndex
        this.activeSource = Object.assign({}, this.fmList[this.playBox.currentIndex], {
          type: 'audio/mp3'
        })
        this.initPlayer()
      }
    },
    play (data) {
      if (data.currentCategory === 'radio') {
        this.activeSource = Object.assign({}, data, {
          type: 'application/x-mpegURL'
        })
        this.playBox.category = data.currentCategory
      } else if (data.currentCategory === 'sound') {
        this.activeSource = Object.assign({}, data, {
          type: 'audio/mp3',
          currentCategory: 'mood'
        })
        this.playBox.category = 'mood'
      }

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

      const that = this

      this.player = videojs('my-player', options, function onPlayerReady () {
        this.play()

        this.on('play', () => {
          that.playBox.status = 'play'
        })
        this.on('pause', () => {
          that.playBox.status = 'pause'
        })
        this.on('ended', () => {
          that.playBox.status = 'ended'
        })
        this.on('druationchange', (e) => {
          that.playBox.duration = 0
          that.playBox.currentTime = 0
        })
        this.on('timeupdate', (e) => {
          that.playBox.duration = Math.floor(this.duration())
          that.playBox.currentTime = Math.floor(this.currentTime())
        })
      })
    },
    setPlayStatus (status) {
      if (this.player) {
        this.player[status]()
      }
    },
    playNext () {
      if (this.player && this.playBox.category === 'mood') {
        if (this.playBox.currentIndex === this.fmList.length - 1) {
          // 已是最后一条，请求下一页
          this.getFmListByMood(this.currentMood)
        } else {
          this.playBox.currentIndex = (this.playBox.currentIndex + 1) % this.fmList.length
          this.activeSource = Object.assign({ type: 'audio/mp3' }, this.fmList[this.playBox.currentIndex])
          this.initPlayer()
        }
      }
    },
    playPrev () {
      if (this.player && this.playBox.category === 'mood') {
        if (this.playBox.currentIndex === 0) {
          // 已是最后一条，请求下一页
          this.playBox.currentIndex = this.fmList.length - 1
        } else {
          this.playBox.currentIndex = (this.playBox.currentIndex - 1) % this.fmList.length
        }
        this.activeSource = Object.assign({ type: 'audio/mp3' }, this.fmList[this.playBox.currentIndex])
        this.initPlayer()
      }
    },
    changeCurrentTime (e) {
      if (this.player) {
        this.player.currentTime(Number(e))
      }
    },
    showSettingsModal () {
      this.settings.bg = this.bg
      this.settings.shown = true
    },
    saveSettings () {
      ipcRenderer.send('fm-set-bg', this.settings.bg)
      this.bg = this.settings.bg
    },
    getFavoriteFmList () {
      this.favorite = ipcRenderer.sendSync('fm-get-all-favorite')
    },
    setFavorite (type) {
      ipcRenderer.sendSync('fm-set-favorite', {
        data: this.activeSource,
        type: type
      })
      this.favorite[type].push(this.activeSource)
    },
    toggleFavorite (type) {
      if (this.favorite[type].some(item => item.url === this.activeSource.url)) {
        this.removeFavorite(type)
        this.$Message.success({
          content: '取消关注成功'
        })
      } else {
        this.setFavorite(type)
        this.$Message.success({
          content: '关注成功'
        })
      }
    },
    removeFavorite (type) {
      ipcRenderer.sendSync('fm-remove-favorite', {
        data: this.activeSource,
        type: type
      })
      let i = 0
      let outIndex = -1
      for (i; i < this.favorite[type].length; i++) {
        if (this.favorite[type][i].url === this.activeSource.url) {
          outIndex = i
          i = this.favorite[type].length
        }
      }
      if (outIndex > -1) {
        this.favorite[type].splice(outIndex, 1)
      }
    }
  },
  watch: {
    'playBox.status' (val) {
      if (val === 'ended') {
        if (this.playBox.category === 'mood') {
          if (this.playBox.currentIndex < this.fmList.length - 1) {
            this.playBox.currentIndex += 1
            this.activeSource = Object.assign({ type: 'audio/mp3' }, this.fmList[this.playBox.currentIndex])
            this.initPlayer()
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes heartbeat {
  0% {
    transform: scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.8, 0.8);
    opacity: 1;
  }
}
.media_fm {
  position: relative;
  -webkit-app-region: drag;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  // background-image: url("~@/assets/bg1.jpg");
  // background-image: url("http://pic1.win4000.com/wallpaper/4/54740e3b7cc5f.jpg");
  // background-image: url("http://lorempixel.com/1366/768/nature/");
  // background-image: url("https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  .media_fm_side_bar_mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: transparent;
    left: 0;
    top: 0;
    z-index: 2;
  }
  .media_fm_side_bar {
    position: absolute;
    top: 0;
    z-index: 2;
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
      position: relative;
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
        .current_mood_wrapper {
          width: 50px;
          height: 50px;
          background-color: #fff;
          border-radius: 50%;
          // background-image: url("~@/assets/fm_mood_icons.png");
          border: 1px solid #fff;
          overflow: hidden;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
        // img {
        //   max-width: 100%;
        //   max-height: 100%;
        // }
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
      .media_fm_side_bar_settings {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 50px;
        color: #fff;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
      .media_fm_side_bar_favorite {
        position: absolute;
        left: 0;
        bottom: 50px;
        width: 100%;
        height: 50px;
        color: #fff;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        svg {
          width: 24px;
          height: 24px;
          fill: rgba(255, 0, 0, 0.2);
          filter: drop-shadow(0px 0px 20px rgb(255, 20, 20));
          animation: heartbeat 1s infinite;
          -webkit-animation: heartbeat 1s infinite;
          transition: fill 0.3s ease-in-out;
        }
        &:hover {
          svg {
            fill: rgba(255, 0, 0, 1);
          }
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
  .play_box {
    padding: 15px;
    box-sizing: border-box;
    .play_box_mood {
      position: relative;
      width: 400px;
      // height: 240px;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      padding: 15px 0;
      box-sizing: border-box;
      border: 1px solid #c8c8c8;
      h2 {
        color: #fff;
        font-size: 18px;
        line-height: 25px;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        padding: 0 15px;
        box-sizing: border-box;
      }
      h4 {
        color: #fff;
        opacity: 0.6;
        line-height: 50px;
        padding: 0 15px;
        box-sizing: border-box;
      }
      .play_box_mood_control {
        padding: 15px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        .play_box_mood_control_item {
          border-radius: 50%;
          border: 2px solid #fff;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
          &.small {
            width: 34px;
            height: 34px;
          }
          &.big {
            width: 45px;
            height: 45px;
          }
        }
        .play_box_mood_control_progress {
          width: 140px;
        }
        .play_box_mood_control_progress_tip {
          width: 60px;
          height: 34px;
          color: #fff;
          margin-left: 8px;
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
        }
      }
    }
    .play_box_radio {
      position: relative;
      width: 200px;
      height: 200px;
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: 4px;
      padding: 15px 0;
      box-sizing: border-box;
      border: 1px solid #c8c8c8;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 200px;
        height: 200px;
      }
      .play_box_radio_btn {
        width: 48px;
        height: 48px;
        z-index: 1;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 2px solid #fff;
        // opacity: 0;
        &:hover {
          background-color: rgba(0, 0, 0, 1);
        }
      }
      &:hover {
        .play_box_radio_btn {
          // opacity: 1;
        }
      }
      .play_box_radio_name {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 24px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        padding: 0 10px;
        box-sizing: border-box;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.6);
        font-size: 13px;
      }
    }
    .play_box_heart {
      position: absolute;
      width: 20px;
      height: 20px;
      right: 8px;
      top: 8px;
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

  .logo_box {
    position: absolute;
    left: 30px;
    top: 40px;
    width: 120px;
    // height: 80px;
    color: #fff;
    text-shadow: 0 0 2px #111;
    .logo_box_title {
      font-size: 25px;
      font-weight: bold;
    }
    .logo_box_slogan {
      letter-spacing: 10px;
    }
  }
}
.settings_modal_item {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  .settings_modal_item_label {
    width: 80px;
  }
  .settings_modal_item_value {
    flex: 1;
    .settings_modal_item_previewer {
      width: 100%;
      height: 200px;
      margin-top: 15px;
      border: 1px solid #ddd;
      overflow: hidden;
      border-radius: 4px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      img {
        max-width: 100%;
        max-width: 100%;
      }
    }
  }
}
</style>