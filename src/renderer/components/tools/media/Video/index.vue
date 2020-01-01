<template>
  <div class="media_video">

    <transition name="fade">
      <div id="videoBox"
           style="width: 100%; height: 100%;"
           v-if="canPlay">
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
    </transition>

    <transition name="fade">
      <div class="playlist_container"
           :class="[playlistShown ? 'shown' : 'hidden']"
           @click.stop="hidePlaylist"
           v-if="canPlay">
        <div class="playlist_inner">
          <div class="playlist_header"></div>
          <div class="playlist_wrapper">
            <div class="playlist_item_group"
                 v-for="(group, index) in playlist"
                 :key="index">
              <p class="playlist_item_group_label"
                 :class="[(activePlaylist[0] === index) ? 'active' : '']">{{group.label}}</p>
              <div class="playlist_item"
                   v-for="(item, idx) in group.children"
                   :key="idx"
                   :class="[(activePlaylist[0] === index) && (activePlaylist[1] === idx) ? 'active' : '']"
                   @click.stop="play(index, idx)">
                <p class="playlist_item_label">{{item.label}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="player_code_container"
           v-if="!canPlay">
        <div class="player_code_box">
          <div class="player_code_box_img">
            <img src="~@/assets/logo.png"
                 alt="Enkel">
          </div>
          <Input placeholder="xxxxxxxx-xxxxxxxx-xxxxxxxx"
                 type="text"
                 class="custom_input"
                 style="width: 250px; border: 1px solid #333; border-radius: 3px;"
                 autofocus
                 clearable
                 v-model="code" />
          <Button type="primary"
                  @click="goPlay">进入播放</Button>
        </div>
      </div>
    </transition>

    <div class="play_file_container"
         :class="[playFileShown ? 'shown' : 'hidden']"
         @click.stop="hidePlayFile">
      <div class="play_file_inner"
           @click.stop="noop">
        <input type="file"
               class="video_input"
               style="opacity: 0;"
               @change="changeVideo" />
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { Input, Button } from 'view-design'
require('video.js/dist/video-js.min.css')
import videojs from 'video.js'
import 'videojs-flash'
import '@videojs/http-streaming'

export default {
  name: 'MediaVideo',
  components: {
    Input, Button
  },
  data () {
    return {
      videoSrc: '',
      player: null,
      playlist: [],
      activePlaylist: [4, 2],
      playlistShown: false,
      playFileShown: true,
      canPlay: false,
      code: '',
      videoFile: null
    }
  },
  computed: {
    activeSource () {
      if (this.videoFile) {
        console.log('=======', URL.createObjectURL(this.videoFile))
        return Object.assign({}, this.videoFile, {
          url: URL.createObjectURL(this.videoFile),
          label: this.videoFile.name,
          lastModified: this.videoFile.lastModified,
          lastModifiedDate: this.videoFile.lastModifiedDate,
          name: this.videoFile.name,
          path: this.videoFile.path,
          size: this.videoFile.size,
          type: this.videoFile.type,
          webkitRelativePath: this.videoFile.webkitRelativePath
        })
      } else if (this.playlist && this.playlist[this.activePlaylist[0]] && this.playlist[this.activePlaylist[0]].children) {
        return this.playlist[this.activePlaylist[0]].children[this.activePlaylist[1]]
      } else {
        return {
          label: '院线大片',
          type: 'application/x-mpegURL',
          url: 'http://hls-ott-zhibo.wasu.tv/live/357/index.m3u8'
        }
      }
    }
  },
  created () {
    this.preloadResources()
  },
  mounted () {
    this.playlist = ipcRenderer.sendSync('get-play-list')
    setTimeout(() => {
      this.initPlayer()
    }, 800)
    this.$nextTick(() => {
      let isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
      isMac && (this.platform = 'mac')
      window.onkeydown = (ev) => {
        if (this.$route.name === 'video') {
          if (this.platform === 'mac') {
            if (ev.metaKey && ev.keyCode === 80) {
              // mac下 command + shift + s
              this.togglePlaylist()
            }
          } else {
            if (ev.ctrlKey && ev.keyCode === 80) {
              // windows下  control + shift + s 保存
              this.togglePlaylist()
            }
          }
        }
      }

    })
  },
  beforeRouteEnter (to, from, next) {
    let code = ipcRenderer.sendSync('init-code')
    next(vm => {
      if (code) {
        vm.code = code
        vm.goPlay()
      }
    })
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  },
  methods: {
    noop () { },
    play (groupIndex, childrenIndex) {
      this.videoFile = null
      this.activePlaylist = [Number(groupIndex), Number(childrenIndex)]
      setTimeout(() => {
        this.initPlayer()
      }, 100)
    },
    initPlayer () {
      // https://www.awaimai.com/2053.html
      var options = {
        bigPlayButton: true,
        textTrackDisplay: false,
        posterImage: true,
        errorDisplay: false,
        techOrder: ['flash', 'html5'],
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        preload: 'auto',
        language: 'zh-CN',
        // muted: true
        // poster: 'http://www.ttkzm.com/uploadfile/201912/15/E213231985.jpg'
      }

      if (!this.canPlay) {
        return
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
        document.querySelector('.vjs-picture-in-picture-control').style.display = 'none'
        // document.querySelector('.video-js .vjs-tech').style.zIndex = 2
        document.querySelector('.video-js .vjs-control-bar').style.zIndex = 3

        that.addItemPlaylist()
        that.addItemPlayFile()

        // http://v.bootstrapmb.com/2019/4/u0d54217
        // http://v.bootstrapmb.com/2018/12/0twha3250
        // http://v.bootstrapmb.com/2019/10/5s65c6354
        // http://v.bootstrapmb.com/2018/11/t36ed2742
        // http://v.bootstrapmb.com/2019/5/lm53h4838
        // http://v.bootstrapmb.com/2019/10/x6xcs6480
        // http://v.bootstrapmb.com/2019/4/lm8y53989
        // http://v.bootstrapmb.com/2019/3/wxmoy3693
        if (that.videoFile && that.videoFile.type && !!that.videoFile.type.match(/^audio/)) {
          that.addMusicBox('http://v.bootstrapmb.com/2019/3/wxmoy3693')
        }

        videojs.log('Your player is ready!')

        this.play()

        // How about an event listener?
        this.on('ended', function () {
          videojs.log('Awww...over so soon?!')
        })
        this.on('error', function () {//请求数据时遇到错误
          console.log("请求数据时遇到错误")
          this.pause()
        })

        // this.on('pause', () => {

        //   // Modals are temporary by default. They dispose themselves when they are
        //   // closed; so, we can create a new one each time the player is paused and
        //   // not worry about leaving extra nodes hanging around.
        //   var modal = this.createModal('This is a modal!')

        //   modal.addClass('vjs-my-fancy-modal')

        //   // When the modal closes, resume playback.
        //   modal.on('modalclose', () => {
        //     this.play()
        //   })
        // })

      })
    },
    preloadResources () {
      let resources = (this.$route.meta && this.$route.meta.resources) ? this.$route.meta.resources : {}
      if (resources.css && (resources.css.length > 0)) {
        let j = 0
        for (j; j < resources.css.length; j++) {
          this.$loadCss(resources.css[j])
        }
      }
      if (resources.js && (resources.js.length > 0)) {
        let j = 0
        for (j; j < resources.js.length; j++) {
          this.$loadJs(resources.js[j])
        }
      }
    },
    hidePlaylist () {
      this.playlistShown = false
    },
    showPlaylist () {
      this.playlistShown = true
    },
    togglePlaylist () {
      this.playlistShown = !this.playlistShown
    },
    hidePlayFile () {
      this.playFileShown = false
    },
    showPlayFile () {
      this.playFileShown = true
    },
    togglePlayFile () {
      this.playFileShown = !this.playFileShown
    },
    goPlay () {
      let res = ipcRenderer.sendSync('verify-code', {
        code: this.code
      })
      if (res.status !== 200 || !res.data || (this.code !== res.data.code)) {
        this.$Notice.error({
          desc: res.message || 'Code不正确'
        })
      } else {
        this.canPlay = true
      }
    },
    addItemPlaylist () {
      const that = this
      let playlistEle = document.createElement('div')
      !playlistEle.classList.contains('video_control_item') && playlistEle.classList.add('video_control_item')
      playlistEle.setAttribute('title', '播放列表')
      playlistEle.onclick = () => {
        that.togglePlaylist()
      }
      let playlistImgEle = document.createElement('img')
      playlistImgEle.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABuklEQVR4Xu1aoU4FMRCcsWgClp94YEHyLUgUCr4Ai+MH+AUSSLAYwgdgSTDgcEsuORLE5WWbtnsbOqe3nensdK/dO2Lwh4OvHxJADhhcAW2BwQ2gIqgtULIFzOwAwIbkXcm4zLFFDjCzNwCTCPcALkg+Z16ch5tbADM7BvDwZ9KvWYQbD1DWmBoBftd0C+CM5HfWRW7j1UKAaf7XWYSnbWBmdgngEMBOJ7E+AbyQvPLO30qAX7xzktdL4Ga2C+DDS6wybo+kC6u1ABPvRfCFGlK5xq3DT0g+egAkgEelKcaZwWG3gLcITsVp89+K4LCvweEOQvsA3ueaMd5ReC6EpwCOSg4a3iK7Vpz7NbgWwd64EqC3wtnnlwOyZ6g3PzmgROGA+3wJnaXYrv2AyPt8rRCr9gNqybcYv2o/oMUCaufoIsDYW2C+C/S+z9dmvl8RrGWWdbzOAVkzE8VLDohSOiuOHJA1M1G85IAopbPiyAElmVE/IO77fklelmLVD1jz/4Da7LUYr35A819k1A9oYcyEc+gckDApoZTkgFC5E4LJAQmTEkpJDgiVOyGYHJAwKaGU5IBQuROC/QCYYaxB0em3QwAAAABJRU5ErkJggg==')
      playlistEle.appendChild(playlistImgEle)
      let volumeEle = document.querySelector('.vjs-volume-panel')
      volumeEle.parentNode.insertBefore(playlistEle, volumeEle)
    },
    addItemPlayFile () {
      const that = this
      let playlistEle = document.createElement('div')
      !playlistEle.classList.contains('video_control_item') && playlistEle.classList.add('video_control_item')
      playlistEle.setAttribute('title', '播放文件')
      playlistEle.onclick = () => {
        that.togglePlayFile()
      }
      let playlistImgEle = document.createElement('img')
      playlistImgEle.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACt0lEQVR4Xu2bwYoUMRCG/+89FFwQBB9FUPAieFqFPYiwigjiRd1FQUTwoIIuuKBePHjUB/HiyYML+h4lWXtktp3uSk9nunsyyXE6naS+qaqkqtIoopnZI0nXJJ2J6N6rC8D8AGZmkr5JOgDe9hp8wcsnJls0eCX8XuqJm8ZrADDrvg8kXUsMgF+STk0EQFhGUggxAIIKDtYcDUiuCesKIJkmrDOAJBDWHUBvCDkACBD2gP1lHFUuAJaGkBOApSDkBqAzhBwBdIKQK4Do3SFnAAHCReBr2+6QO4AvwKVNBqB6bFGHMXkNWOZw0+WdyQGQdBr43UWIPn2nCCBpvO/BmSKA431c0gfgyBOg7/OpAugr17/3184JJpO8GqgAqGWZJ78NFg1ITKCYQDGBk5Wm4gNqBMo5wPM5VXHS6zbZ58UJFic4jBMMRYl3y4axZhaqzzuSwj2EtvYKuGVm5yRdlvTUs70hTCBZ+GpmIQpsgvAAeDIvsJndkfSiNeU1gAlspQpbzSzcQPm5QKB7wPP672Z2XtL3UQF4Kuap6AKh6vcRbgMvm8bxdilvfb3PAd4EPQHcBN60jZEzgB3g0AOYK4Bt4KMnfHieI4CrwKcY4bMEECv4rF92GlAAdCRQNODvVdrG5m3TUzwHbLYTrFT6OvA+xhqyM4E5gW4ABx6EnAEE2XeB15t6FJ7JfRdoDHlH14CU9fwqMRKu59fbfeDZgsjxrKQfo+4CKe/vOwmRh8DjeWHNbFdSY6gc+q58G6wW1KueXyVCtqt7AW1/6GfgSpUIuSDpvyRJ/eWhAHjOerTnBcAAOcHR/t2YiYsGFA0YpjASo42j9CkmUEygmEBrziMmIRJKVSv/aHpFDuII2GqNFbyJh/542ltPx+du4dbVgDBhBSGUrwf7iLqjoPXu4bb5YcyX5n8A0eH+UJvaI00AAAAASUVORK5CYII=')
      playlistImgEle.style.width = '14px'
      playlistImgEle.style.height = '14px'
      playlistEle.appendChild(playlistImgEle)
      let volumeEle = document.querySelector('.vjs-volume-panel')
      volumeEle.parentNode.insertBefore(playlistEle, volumeEle)
    },
    addMusicBox (src) {
      // vjs-tech
      const that = this
      let playlistEle = document.createElement('div')
      !playlistEle.classList.contains('music_container') && playlistEle.classList.add('music_container')
      let musicBox = document.createElement('iframe')
      musicBox.src = src || 'http://v.bootstrapmb.com/2019/4/u0d54217/'
      playlistEle.appendChild(musicBox)
      let volumeEle = document.querySelector('.vjs-tech')
      volumeEle.parentNode.insertBefore(playlistEle, volumeEle)
      // document.querySelector('.video-js').innerHTML += '<div class="music_container"></div>'
    },
    changeVideo (event) {
      if (event.target.files.length > 0) {
        this.videoFile = event.target.files[0]
        this.activePlaylist = [-1, -1]
        setTimeout(() => {
          this.initPlayer()
        }, 100)
        // this.initPlayer()
        console.log('File: ', event)
      }
    },
  },
  watch: {
    canPlay (val) {
      if (val) {
        setTimeout(() => {
          this.initPlayer()
        }, 300)
      }
    }
  }
}
</script>

<style lang="less" >
.media_video {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  -webkit-app-region: drag;
  video:focus {
    outline: none;
  }
  .playlist_container {
    position: absolute;
    top: 0;
    transition: left 0.2s ease-in-out;
    width: 100%;
    height: 100%;
    z-index: 9;
    .playlist_inner {
      position: absolute;
      top: 0;
      width: 200px;
      height: 100%;
      padding: 48px 0 15px 0;
      transition: left 0.25s ease-in-out;
      box-sizing: border-box;
      background-color: rgba(0, 0, 0, 0.8);
      .playlist_header {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 48px;
        background-color: rgba(0, 0, 0, 1);
      }
      .playlist_wrapper {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        .playlist_item_group {
          .playlist_item_group_label {
            position: sticky;
            left: 0;
            top: 0;
            width: 100%;
            height: 32px;
            padding: 0 15px;
            box-sizing: border-box;
            // background-color: rgba(0, 0, 0, 0.3);
            background-image: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 1),
              rgba(0, 0, 0, 0.6)
            );
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            font-size: 15px;
            font-weight: bolder;
            color: #c8c8c8;
            &.active {
              color: #99ff00;
            }
          }
          .playlist_item {
            padding-left: 15px;
            box-sizing: border-box;
            width: 100%;
            height: 32px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            font-size: 14px;
            color: #bbb;
            cursor: pointer;
            .playlist_item_label {
              padding-left: 8px;
              box-sizing: border-box;
            }
            &:hover {
              color: #99ff00;
            }
            &.active {
              color: #99ff00;
              .playlist_item_label {
                border-left: 3px solid #99ff00;
              }
            }
          }
        }
      }
    }
    &.shown {
      left: 0;
      transition-delay: 0;
      .playlist_inner {
        left: 0;
        transition-delay: 0.2s;
      }
    }
    &.hidden {
      left: -5000px;
      transition-delay: 0.5s;
      .playlist_inner {
        left: -300px;
        transition-delay: 0;
      }
    }
  }

  .video-js .vjs-big-play-button {
    font-size: 2.5em;
    line-height: 2.3em;
    height: 2.5em;
    width: 2.5em;
    -webkit-border-radius: 2.5em;
    -moz-border-radius: 2.5em;
    border-radius: 2.5em;
    background-color: #73859f;
    background-color: rgba(115, 133, 159, 0.5);
    border-width: 0.15em;
    margin-top: -1.25em;
    margin-left: -1.75em;
  }
  /* 中间的播放箭头 */
  .vjs-big-play-button .vjs-icon-placeholder {
    font-size: 1.63em;
  }
  /* 加载圆圈 */
  .vjs-loading-spinner {
    font-size: 2.5em;
    width: 2em;
    height: 2em;
    border-radius: 1em;
    margin-top: -1em;
    margin-left: -1.5em;
  }

  .player_code_container {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 98;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .player_code_box {
      width: 300px;
      height: 200px;
      background-color: rgba(0, 0, 0, 1);
      box-shadow: 0 0 20px 1px #222;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      .player_code_box_img {
        width: 100%;
        // height: 80px;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;
        img {
          width: 56px;
          height: 56px;
        }
      }
    }
  }

  .play_file_container {
    position: absolute;
    top: 0;
    transition: left 0.2s ease-in-out;
    width: 100%;
    height: 100%;
    z-index: 9;
    .play_file_inner {
      position: absolute;
      top: 0;
      width: 200px;
      height: 100%;
      padding: 48px 0 15px 0;
      transition: left 0.25s ease-in-out;
      box-sizing: border-box;
      background-color: rgba(0, 0, 0, 0.8);
    }
    &.shown {
      left: 0;
      transition-delay: 0;
      .play_file_inner {
        left: 0;
        transition-delay: 0.2s;
      }
    }
    &.hidden {
      left: -5000px;
      transition-delay: 0.5s;
      .play_file_inner {
        left: -300px;
        transition-delay: 0;
      }
    }
  }
}

.video_input {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
  // pointer-events: none;
  &:focus {
    outline: none;
  }
}

.music_container {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
  background-color: #000;
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>