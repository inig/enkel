<template>
  <div class="media_video">
    <video class="video-js vjs-big-play-centered"
           controls
           preload="auto"
           id="my-player"
           data-setup='{}'
           style="width: 100%; height: 100%;">
      <!-- <source id="source"
              src="http://tx.hls.huya.com/huyalive/30765679-2554414705-10971127618396487680-3048991636-10057-A-0-1.m3u8"
              type="application/x-mpegURL">
      </source> -->
      <!-- <source id="source"
              src="http://hls-ott-zhibo.wasu.tv/live/394/index.m3u8"
              type="application/x-mpegURL">
      </source> -->
    </video>
    <div class="playlist_container">
      <div class="playlist_inner"></div>
    </div>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import { Input, Button } from 'view-design'
  export default {
    name: 'MediaVideo',
    components: {
      Input, Button
    },
    data () {
      return {
        videoSrc: '',
        player: null
      }
    },
    created () {
      console.log(this.$route)
      this.preloadResources()
    },
    mounted () {
      this.$nextTick(() => {
        this.initPlayer()
      })
      let playlist = ipcRenderer.sendSync('get-play-list')
      console.log(playlist)
    },
    methods: {
      initPlayer () {
        // https://www.awaimai.com/2053.html
        var options = {
          bigPlayButton: true,
          textTrackDisplay: false,
          posterImage: false,
          errorDisplay: false
        }

        this.player = videojs('my-player', options, function onPlayerReady () {
          videojs.log('Your player is ready!')

          // In this context, `this` is the player that was created by Video.js.
          this.play()

          // How about an event listener?
          this.on('ended', function () {
            videojs.log('Awww...over so soon?!')
          })
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
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      .playlist_inner {
        position: absolute;
        left: 0;
        top: 0;
        width: 300px;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
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
</style>