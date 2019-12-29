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
      activePlaylist: [3, 2],
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
    // this.$nextTick(() => {
    //   setTimeout(() => {
    //     this.initPlayer()
    //   }, 300)
    // })
    setTimeout(() => {
      this.initPlayer()
    }, 500)
    this.playlist = ipcRenderer.sendSync('get-play-list')

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

    // videojs.addLanguage('zh-CN', {
    //   "Play": "播放",
    //   "Pause": "暂停",
    //   "Current Time": "当前时间",
    //   "Duration": "时长",
    //   "Remaining Time": "剩余时间",
    //   "Stream Type": "媒体流类型",
    //   "LIVE": "直播",
    //   "Loaded": "加载完毕",
    //   "Progress": "进度",
    //   "Fullscreen": "全屏",
    //   "Non-Fullscreen": "退出全屏",
    //   "Mute": "静音",
    //   "Unmute": "取消静音",
    //   "Playback Rate": "播放速度",
    //   "Subtitles": "字幕",
    //   "subtitles off": "关闭字幕",
    //   "Captions": "内嵌字幕",
    //   "captions off": "关闭内嵌字幕",
    //   "Chapters": "节目段落",
    //   "Close Modal Dialog": "关闭弹窗",
    //   "Descriptions": "描述",
    //   "descriptions off": "关闭描述",
    //   "Audio Track": "音轨",
    //   "You aborted the media playback": "视频播放被终止",
    //   "A network error caused the media download to fail part-way.": "网络错误导致视频下载中途失败。",
    //   "The media could not be loaded, either because the server or network failed or because the format is not supported.": "视频因格式不支持或者服务器或网络的问题无法加载。",
    //   "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "由于视频文件损坏或是该视频使用了你的浏览器不支持的功能，播放终止。",
    //   "No compatible source was found for this media.": "无法找到此视频兼容的源。",
    //   "The media is encrypted and we do not have the keys to decrypt it.": "视频已加密，无法解密。",
    //   "Play Video": "播放视频",
    //   "Close": "关闭",
    //   "Modal Window": "弹窗",
    //   "This is a modal window": "这是一个弹窗",
    //   "This modal can be closed by pressing the Escape key or activating the close button.": "可以按ESC按键或启用关闭按钮来关闭此弹窗。",
    //   ", opens captions settings dialog": ", 开启标题设置弹窗",
    //   ", opens subtitles settings dialog": ", 开启字幕设置弹窗",
    //   ", opens descriptions settings dialog": ", 开启描述设置弹窗",
    //   ", selected": ", 选择",
    //   "captions settings": "字幕设定",
    //   "Audio Player": "音频播放器",
    //   "Video Player": "视频播放器",
    //   "Replay": "重播",
    //   "Progress Bar": "进度小节",
    //   "Volume Level": "音量",
    //   "subtitles settings": "字幕设定",
    //   "descriptions settings": "描述设定",
    //   "Text": "文字",
    //   "White": "白",
    //   "Black": "黑",
    //   "Red": "红",
    //   "Green": "绿",
    //   "Blue": "蓝",
    //   "Yellow": "黄",
    //   "Magenta": "紫红",
    //   "Cyan": "青",
    //   "Background": "背景",
    //   "Window": "视窗",
    //   "Transparent": "透明",
    //   "Semi-Transparent": "半透明",
    //   "Opaque": "不透明",
    //   "Font Size": "字体尺寸",
    //   "Text Edge Style": "字体边缘样式",
    //   "None": "无",
    //   "Raised": "浮雕",
    //   "Depressed": "压低",
    //   "Uniform": "均匀",
    //   "Dropshadow": "下阴影",
    //   "Font Family": "字体库",
    //   "Proportional Sans-Serif": "比例无细体",
    //   "Monospace Sans-Serif": "单间隔无细体",
    //   "Proportional Serif": "比例细体",
    //   "Monospace Serif": "单间隔细体",
    //   "Casual": "舒适",
    //   "Script": "手写体",
    //   "Small Caps": "小型大写字体",
    //   "Reset": "重启",
    //   "restore all settings to the default values": "恢复全部设定至预设值",
    //   "Done": "完成",
    //   "Caption Settings Dialog": "字幕设定视窗",
    //   "Beginning of dialog window. Escape will cancel and close the window.": "开始对话视窗。离开会取消及关闭视窗",
    //   "End of dialog window.": "结束对话视窗"
    // })
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
        posterImage: false,
        errorDisplay: false
      }

      this.player = videojs('my-player')
      this.player.pause()
      this.player.dispose()
      let videoBox = document.querySelector('#videoBox')
      videoBox.innerHTML = ''
      let videoStr = `<video class="video-js vjs-big-play-centered"
             controls
             preload="auto"
             id="my-player"
             data-setup='{}'
             style="width: 100%; height: 100%;">
        <source id="source"
                src="${this.activeSource.url}"
                type="${this.activeSource.type}">
        </source>
      </video>`
      videoBox.innerHTML = videoStr

      this.player = videojs('my-player', options, function onPlayerReady () {
        videojs.log('Your player is ready!')

        // In this context, `this` is the player that was created by Video.js.
        this.play()

        // How about an event listener?
        this.on('ended', function () {
          videojs.log('Awww...over so soon?!')
        })
        this.on('error', function () {//请求数据时遇到错误
          console.log("请求数据时遇到错误")
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
</style>