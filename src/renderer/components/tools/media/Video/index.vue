<template>
  <div class="media_video">
    <div id="videoBox"
         style="width: 100%; height: 100%;">
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
    <div class="playlist_container"
         :class="[playlistShown ? 'shown' : 'hidden']"
         @click.stop="hidePlaylist">
      <div class="playlist_inner">
        <div class="playlist_header"></div>
        <div class="playlist_wrapper">
          <div class="playlist_item_group"
               v-for="(group, index) in playlist"
               :key="index">
            <p class="playlist_item_group_label">{{group.label}}</p>
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
      playlistShown: true
    }
  },
  computed: {
    activeSource () {
      if (this.playlist && this.playlist[this.activePlaylist[0]] && this.playlist[this.activePlaylist[0]].children) {
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
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  },
  methods: {
    play (groupIndex, childrenIndex) {
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
        // poster: 'http://www.ttkzm.com/uploadfile/201912/15/E213231985.jpg'
      }

      this.player = videojs('my-player')
      if (this.player) {
        this.player.pause()
        this.player.dispose()
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
        videojs.log('Your player is ready!')

        console.log('>>>>>>>', this)

        // In this context, `this` is the player that was created by Video.js.
        this.play()

        // How about an event listener?
        this.on('ended', function () {
          videojs.log('Awww...over so soon?!')
        })
        this.on('error', function () {//请求数据时遇到错误
          console.log("请求数据时遇到错误")
          // this.pause()
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
}

// .vjs-my-fancy-modal {
//   position: absolute;
//   width: 300px;
//   height: 200px;
//   left: 0;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   margin: auto;
//   background: red;
// }
</style>