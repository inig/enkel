<template>
  <div class="container">
    <div class="video_box"
         :style="{borderBottomLeftRadius: (!discoverModal.shown && !playListModal.shown && !searchModal.shown) ? '5px' : '0px', borderBottomRightRadius: (!discoverModal.shown && !playListModal.shown && !searchModal.shown) ? '5px' : '0px'}">
      <div class="video_box_top">
        <div class="video_box_top_left">
          <img src="~@/assets/images/flac/fallback_album_art.png"
               alt="封面">
          <transition name="fade">
            <div class="audio_loading"
                 v-if="playBox.isLoading && (playBox.status === 'play')">
              <svg>
                <use xlink:href="#loading"></use>
              </svg>
            </div>
          </transition>
        </div>
        <div class="video_box_top_right">
          <div class="video_box_top_right_artist">
            <div class="video_box_top_right_artist_title">{{playList[activeIndex] ? playList[activeIndex].name : 'No Name'}}</div>
            <div class="video_box_top_right_artist_name">{{playList[activeIndex] ? playList[activeIndex].artist : 'No Artist'}}</div>
          </div>
          <div class="video_box_top_right_controls">
            <div class="video_box_top_right_controls_item small"
                 @click="playPrev">
              <Icon type="ios-skip-backward"
                    color="#fff"
                    size="16" />
            </div>
            <div class="video_box_top_right_controls_item big"
                 v-if="playBox.status === 'pause'"
                 @click="play">
              <Icon type="ios-play"
                    style="margin-left: 4px;"
                    color="#fff"
                    size="28" />
            </div>
            <div class="video_box_top_right_controls_item big "
                 v-if="playBox.status === 'play'"
                 @click="pause">
              <Icon type="ios-pause"
                    color="#fff"
                    size="28" />
            </div>
            <div class="video_box_top_right_controls_item small "
                 @click="playNext">
              <Icon type="ios-skip-forward"
                    color="#fff"
                    size="16" />
            </div>
          </div>
        </div>
      </div>
      <div class="video_box_middle">
        <span class="video_box_middle_current">{{playBox.currentTime | timeFilter}}</span>
        <Slider :value="playBox.currentTime"
                :max="playBox.duration"
                style="width: 100%;"
                :tip-format="(value) => $timeFilter(value)"
                @on-change="changeCurrentTime"></Slider>
        <span class="video_box_middle_remaining">{{(playBox.duration - playBox.currentTime) | timeFilter}}</span>
      </div>
      <div class="video_box_bottom">

        <div class="video_box_bottom_playlist"
             @click="togglePlayList"
             title="播放列表">
          <svg :style="{fill: playListModal.shown ? '#4fc08d' : 'rgb(201, 201, 201)'}">
            <use xlink:href="#playlist"></use>
          </svg>
        </div>

        <div class="video_box_bottom_discover"
             @click="toggleDiscover"
             title="发现更多">
          <svg :style="{fill: discoverModal.shown ? '#4fc08d' : 'rgb(201, 201, 201)'}">
            <use xlink:href="#global"></use>
          </svg>
        </div>

        <div class="video_box_bottom_item"
             @click="toggleSearch"
             title="搜索">
          <svg :style="{fill: searchModal.shown ? '#4fc08d' : 'rgb(201, 201, 201)'}">
            <use xlink:href="#search"></use>
          </svg>
        </div>

        <!-- <transition name="fade">
          <div class="video_box_bottom_download"
               @click="downloadItem"
               title="下载"
               v-if="activeIndex > -1">
            <Icon type="md-download"
                  size="24"
                  style="color: rgb(201, 201, 201);" />
          </div>
        </transition> -->

        <div class="video_box_bottom_volume"
             :class="[volumeBox.shown ? 'show' : 'hide']"
             @mouseenter="volumeBox.shown = true"
             @mouseleave="volumeBox.shown = false">
          <div class="video_box_bottom_volume_slider">
            <Slider :value="playBox.volume"
                    :max="100"
                    style="width: 100%;"
                    :show-tip="'never'"
                    @on-change="setVolume"
                    @on-input="changeVolume"></Slider>
            <div class="video_box_bottom_volume_slider_text">{{playBox.volume}}</div>
          </div>
          <div class="video_box_bottom_volume_icon"
               @click="toggleMute">
            <Icon :type="volumeIcon"
                  color="#fff"
                  size="20" />
          </div>
        </div>
        <div class="video_box_bottom_loop"
             @click="changeLoopType">
          <svg>
            <use :xlink:href="'#controls-' + playBox.loopType"></use>
          </svg>
          <!-- <img v-if="playBox.loopType === 'loop'"
               src="~@/assets/images/flac/loop.png">
          <img v-else-if="playBox.loopType === 'random'"
               src="~@/assets/images/flac/random.png">
          <img v-else
               src="~@/assets/images/flac/repeat.png"> -->
        </div>
      </div>
    </div>

    <div class="flac_content"
         :class="[playListModal.shown ? 'show' : 'hide']">
      <PlayList :play-list="playList"
                :active-index="activeIndex"
                @change-active-index="changeActiveIndex"></PlayList>
    </div>

    <div class="flac_content"
         :class="[discoverModal.shown ? 'show' : 'hide']">
      <Discover></Discover>
    </div>

    <div class="flac_content"
         :class="[searchModal.shown ? 'show' : 'hide']">
      <Search></Search>
    </div>

    <audio ref="audioRef"
           style="opacity: 0;"
           id="audio"
           :src="(activeIndex > -1 && playList[activeIndex]) ? playList[activeIndex].url : ''"
           type="audio/flac"
           preload
           autoplay
           :loop="playBox.loopType === 'repeat'"
           :volume="parseFloat(playBox.volume / 100).toFixed(1)"
           :muted="playBox.isMute"
           @canplay="canplay"
           @durationchange="durationchange"
           @timeupdate="timeupdate"
           @waiting="waiting"
           @ended="ended"
           @pause="setPlayStatus('pause')"
           @playing="setPlayStatus('play')"></audio>
    <!-- <Button type="primary"
            @click="getRealPath">获取真实地址</Button> -->
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import { Button, Slider, Icon, Tooltip } from 'view-design'
  export default {
    name: 'MediaFlac',
    components: {
      Button, Slider, Icon, Tooltip,
      PlayList: () => import('./PlayList'),
      Discover: () => import('./Discover'),
      Search: () => import('./Search')
    },
    data () {
      return {
        url: 'https://pan.baidu.com/s/1bo9Rajl', // 资源地址
        code: 't864',
        player: null,
        playBox: {
          status: 'pause', // 播放状态
          data: {}, // 播放数据
          currentIndex: -1, // 当前播放列表索引值
          category: 'mood',
          duration: 0,
          currentTime: 0,
          cachedVolume: 100,
          volume: 100,
          isLoading: true,
          isMute: false,
          loopType: 'repeat', // repeat: 单曲重复；loop: 列表循环；random: 随机播放
        },
        volumeBox: {
          shown: false
        },
        playList: [
          {
            url: 'https://static.dei2.com/sounds/demo.flac',
            type: 'audio/x-flac',
            name: '对的那个人.flac',
            artist: '陈娟儿'
          },
          {
            url: 'https://static.dei2.com/sounds/demo2.flac',
            type: 'audio/x-flac',
            name: '一曲相思.flac',
            artist: '半阳'
          },
          {
            url: 'https://static.dei2.com/sounds/demo.flac',
            type: 'audio/x-flac',
            name: '对的那个人.flac',
            artist: '陈娟儿'
          },
          {
            url: 'https://static.dei2.com/sounds/demo2.flac',
            type: 'audio/x-flac',
            name: '一曲相思.flac',
            artist: '半阳'
          },
          {
            url: 'https://static.dei2.com/sounds/demo.flac',
            type: 'audio/x-flac',
            name: '对的那个人.flac',
            artist: '陈娟儿'
          },
          {
            url: 'https://static.dei2.com/sounds/demo2.flac',
            type: 'audio/x-flac',
            name: '一曲相思.flac',
            artist: '半阳'
          },
          {
            url: 'https://static.dei2.com/sounds/demo.flac',
            type: 'audio/x-flac',
            name: '对的那个人.flac',
            artist: '陈娟儿'
          },
          {
            url: 'https://static.dei2.com/sounds/demo2.flac',
            type: 'audio/x-flac',
            name: '一曲相思.flac',
            artist: '半阳'
          },
          {
            url: 'https://static.dei2.com/sounds/demo2.flac',
            type: 'audio/x-flac',
            name: '一曲相思.flac',
            artist: '半阳'
          },
          {
            url: 'https://static.dei2.com/sounds/demo.flac',
            type: 'audio/x-flac',
            name: '对的那个人.flac',
            artist: '陈娟儿'
          },
          {
            url: 'https://static.dei2.com/sounds/demo2.flac',
            type: 'audio/x-flac',
            name: '一曲相思.flac',
            artist: '半阳'
          },
          {
            url: 'https://static.dei2.com/sounds/demo.flac',
            type: 'audio/x-flac',
            name: '对的那个人.flac',
            artist: '陈娟儿'
          },
          {
            url: 'https://static.dei2.com/sounds/demo2.flac',
            type: 'audio/x-flac',
            name: '一曲相思.flac',
            artist: '半阳'
          }
        ],
        activeIndex: -1,
        playListModal: {
          shown: false
        },
        discoverModal: {
          shown: false
        },
        searchModal: {
          shown: false
        },
        activeSource: {
          // url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Debussy_-_Pour_les_accords.flac',
          url: 'https://static.dei2.com/sounds/demo.flac',
          // url: 'http://d.pcs.baidu.com/file/9cf73dfb9b845623b2e2ec4eaf1c6e8e?fid=3610725717-250528-1049961648578531&dstime=1582908171&rt=sh&sign=FDtAERVyK-DCb740ccc5511e5e8fedcff06b081203-WjvSGkchqd9YMlc%2FTjAHJXEil8E%3D&expires=8h&chkv=1&chkbd=0&chkpc=&dp-logid=1369066902920002872&dp-callid=0&shareid=1963030568&r=371039862&clienttype=0&vuk=3610725717&vip=0',
          type: 'audio/x-flac'
        },
        list: {
          shown: false
        }
      }
    },
    computed: {
      volumeIcon () {
        if (this.playBox.isMute) {
          return 'md-volume-off'
        } else if (this.playBox.volume === 0) {
          return 'md-volume-mute'
        } else if (this.playBox.volume < 50) {
          return 'md-volume-down'
        } else {
          return 'md-volume-up'
        }
      },
    },
    mounted () {
      this.initPlayer()
      ipcRenderer.on('flac-response-real-path', this.insertPlay)
    },
    methods: {
      getPlayList () {

      },
      initPlayer () {
        if (!this.player) {
          this.player = this.$refs.audioRef
        }
      },
      getRealPath () {
        ipcRenderer.send('flac-get-real-path', {
          url: this.url,
          code: this.code
        })
      },
      insertPlay (event, data) {
        // this.pause()
        this.playList.push({
          url: data.dlink, // 'https://static.dei2.com/sounds/demo.flac',
          type: 'audio/x-flac',
          name: data.server_filename,
          artist: 'No Artist'
        })
        this.activeIndex = this.playList.length - 1
        this.play()
      },
      play () {
        this.setPlayStatus('play')
        this.initPlayer()
        setTimeout(() => {
          this.player.play()
        }, 100)
      },
      pause () {
        this.setPlayStatus('pause')
        this.initPlayer()
        this.player.pause()
      },
      togglePlay () {
        if (this.playBox.status === 'pause') {
          this.play()
        } else {
          this.pause()
        }
      },
      hidePlayList () {
        this.playListModal.shown = false
      },
      togglePlayList () {
        if (!this.playListModal.shown) {
          this.setWindowSize({
            height: 667
          })
        } else {
          this.setWindowSize({
            height: 250
          })
        }
        this.hideDiscover()
        this.hideSearch()
        this.playListModal.shown = !this.playListModal.shown
      },
      hideDiscover () {
        this.discoverModal.shown = false
      },
      toggleDiscover () {
        if (!this.discoverModal.shown) {
          ipcRenderer.send('flac-get-play-list')
          this.setWindowSize({
            height: 667
          })
        } else {
          this.setWindowSize({
            height: 250
          })
        }
        this.hidePlayList()
        this.hideSearch()
        this.discoverModal.shown = !this.discoverModal.shown
      },
      hideSearch () {
        this.searchModal.shown = false
      },
      toggleSearch () {
        if (!this.searchModal.shown) {
          ipcRenderer.send('flac-get-play-list')
          this.setWindowSize({
            height: 667
          })
        } else {
          this.setWindowSize({
            height: 250
          })
        }
        this.hidePlayList()
        this.hideDiscover()
        this.searchModal.shown = !this.searchModal.shown
      },
      setWindowSize (size) {
        ipcRenderer.sendSync('set-window-size', size)
      },
      changeCurrentTime (e) {
        this.initPlayer()
        this.player.currentTime = Number(e)
      },
      setVolume (e) {
        this.playBox.cachedVolume = this.playBox.volume
      },
      changeVolume (e) {
        this.initPlayer()
        this.playBox.volume = Number(e)
        this.player.volume = parseFloat(this.playBox.volume / 100).toFixed(1)
        if (this.playBox.volume > 0) {
          this.playBox.isMute = false
          this.player.muted = false
        }
      },
      playPrev () {
        if (this.playBox.loopType === 'random') {
          this.activeIndex = Math.floor(Math.random() * this.playList.length)
        } else {
          this.activeIndex = (this.activeIndex - 1 + this.playList.length) % this.playList.length
        }
        this.play()
      },
      playNext () {
        if (this.playBox.loopType === 'random') {
          this.activeIndex = Math.floor(Math.random() * this.playList.length)
        } else {
          this.activeIndex = (this.activeIndex + 1) % this.playList.length
        }
        this.play()
      },
      setPlayStatus (status) {
        this.playBox.status = status
      },
      canplay (e) {
        this.playBox.isLoading = false
      },
      durationchange (e) {
        this.playBox.duration = this.player.duration
      },
      timeupdate (e) {
        this.playBox.currentTime = this.player.currentTime
      },
      waiting (e) {
        this.playBox.isLoading = true
      },
      ended (e) {
        switch (this.playBox.loopType) {
          case 'loop':
            this.activeIndex = (this.activeIndex + 1) % this.playList.length
            break
          case 'random':
            this.activeIndex = Math.floor(Math.random() * this.playList.length)
            break
          default:
            break
        }
        this.play()
      },
      setAudioMuted () {
        this.playBox.volume = 0
        this.playBox.isMute = true
        this.initPlayer()
        this.player.muted = true
      },
      cancelAudioMuted () {
        this.playBox.volume = this.playBox.cachedVolume
        this.playBox.isMute = false
        this.initPlayer()
        this.player.muted = false
      },
      toggleMute () {
        if (this.playBox.isMute) {
          this.cancelAudioMuted()
        } else {
          this.setAudioMuted()
        }
      },
      changeLoopType () {
        let allLoopType = ['repeat', 'loop', 'random']
        this.playBox.loopType = allLoopType[(allLoopType.indexOf(this.playBox.loopType) + 1) % allLoopType.length]
        if (this.playBox.loopType === 'repeat') {
          this.player.loop = true
        } else {
          this.player.loop = false
        }
      },
      changeActiveIndex (index) {
        this.activeIndex = index
        this.play()
      },
      downloadItem () {
        ipcRenderer.send('flac-save', {
          filename: this.playList[this.activeIndex].name,
          url: this.playList[this.activeIndex].url
        })
        // alert(JSON.stringify(this.playList[this.activeIndex], null, 2))
      }
    }
  }
</script>

<style lang="less" scoped>
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .demo-spin-col {
    height: 100px;
    position: relative;
    border: 1px solid #eee;
  }
  .container {
    position: relative;

    width: 100%;
    height: 100%;
    // background-color: red;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    overflow: hidden;
    .video_box {
      position: absolute;
      top: 0;
      width: 100%;
      height: 250px;
      z-index: 1;
      padding: 18px 18px 5px 18px;
      background: -webkit-linear-gradient(#32363c, #17191e);
      // border-radius: 5px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border: 1px solid rgba(0, 0, 0, 0.85);
      &_top {
        width: 100%;
        height: 130px;
        -webkit-app-region: drag;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        &_left {
          position: relative;
          width: 130px;
          height: 130px;
          display: flex;
          flex-direction: row;
          align-items: center;
          border: 1px solid rgba(0, 0, 0, 0.63);
          box-shadow: rgba(0, 0, 0, 0.35) 0 1px 5px;
          .audio_loading {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            svg {
              width: 64px;
              height: 64px;
              fill: #fff;
            }
          }
          img {
            width: 100%;
          }
          &::after {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: -1px;
            content: " ";
            background: -webkit-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.15) 50%,
              transparent 50%
            );
            background: -moz-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.15) 50%,
              transparent 50%
            );
            background: -o-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.15) 50%,
              transparent 50%
            );
            box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0 inset;
          }
        }
        &_right {
          width: calc(~"100% - 130px");
          height: 130px;
          padding-left: 10px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          &_artist {
            width: 100%;
            height: 50px;
            &_title {
              width: 100%;
              height: 30px;
              line-height: 30px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-family: Helvetica, Arial, "DejaVu Sans", sans-serif;
              font-weight: 500;
              font-size: 14px;
              color: white;
              margin: 0;
              text-shadow: black 0 -1px 0;
            }
            &_name {
              width: 100%;
              height: 20px;
              line-height: 20px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-family: Helvetica, Arial, "DejaVu Sans Condensed", sans-serif;
              font-size: 12px;
              color: #a7aab1;
              text-shadow: black 0 -1px 0;
            }
          }
          &_controls {
            width: 100%;
            height: 50px;
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-around;
            flex-wrap: nowrap;
            &_item {
              border-radius: 50%;
              border: 2px solid rgb(201, 201, 201);
              box-sizing: border-box;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              // margin-right: 20px;
              cursor: pointer;
              &:hover {
                opacity: 0.7;
              }
              &.small {
                width: 24px;
                height: 24px;
              }
              &.big {
                width: 45px;
                height: 45px;
              }
            }
          }
        }
      }
      &_middle {
        width: 100%;
        height: 36px;
        margin-top: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        -webkit-app-region: no-drag;
        &_current {
          display: inline-block;
          color: #fff;
          font-size: 12px;
          width: 80px;
        }
        &_remaining {
          display: inline-block;
          color: #fff;
          font-size: 12px;
          width: 80px;
          text-align: right;
        }
      }
      &_bottom {
        position: relative;
        width: 100%;
        height: calc(~"100% - 130px - 15px - 36px");
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        -webkit-app-region: no-drag;
        &_playlist {
          position: absolute;
          left: 0;
          width: 24px;
          height: 36px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          svg {
            width: 22px;
            height: 22px;
            &:hover {
              opacity: 0.7;
              cursor: pointer;
            }
          }
        }
        &_discover {
          position: absolute;
          left: 34px;
          width: 24px;
          height: 36px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          svg {
            fill: rgb(201, 201, 201);
            width: 22px;
            height: 22px;
            &:hover {
              opacity: 0.7;
              cursor: pointer;
            }
          }
        }
        &_item {
          position: absolute;
          left: 68px;
          width: 24px;
          height: 36px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          svg {
            width: 20px;
            height: 20px;
            &:hover {
              opacity: 0.7;
              cursor: pointer;
            }
          }
        }
        &_volume {
          position: relative;
          height: 36px;
          cursor: pointer;
          overflow-x: hidden;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
          transform-origin: 100% 50%;
          transition: width 0.3s ease-in-out;
          &_slider {
            position: absolute;
            right: 34px;
            width: 120px;
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            &_text {
              width: 48px;
              margin-left: 8px;
              color: rgb(201, 201, 201);
              font-size: 12px;
              text-align: center;
            }
          }
          &.show {
            width: 184px;
          }
          &.hide {
            width: 24px;
          }
          &_icon {
            position: absolute;
            width: 24px;
            right: 0;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            i {
              &:hover {
                opacity: 0.7;
              }
            }
          }
        }
        &_loop {
          width: 24px;
          height: 36px;
          margin-left: 10px;
          display: flex;
          flex-direction: row;
          align-items: center;
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
          svg {
            width: 20px;
            height: 20px;
            fill: rgb(201, 201, 201);
          }
        }
      }
    }
    .play_list_container {
      position: absolute;
      top: 250px;
      width: 100%;
      z-index: 0;
      // max-height: 80px;
      max-height: calc(~"100% - 250px");
      transform-origin: 50% 0%;
      // transition: all 0.15s linear;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      overflow: hidden;
      // background-color: transparent;
      &.show {
        opacity: 1;
        pointer-events: auto;
      }
      &.hide {
        opacity: 0;
        pointer-events: none;
      }
    }
    .discover_container {
      position: absolute;
      top: 250px;
      width: 100%;
      z-index: 0;
      // max-height: 80px;
      max-height: calc(~"100% - 250px");
      transform-origin: 50% 0%;
      // transition: all 0.15s linear;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      overflow: hidden;
      // background-color: transparent;
      &.show {
        opacity: 1;
        pointer-events: auto;
      }
      &.hide {
        opacity: 0;
        pointer-events: none;
      }
    }
    .flac_content {
      position: absolute;
      top: 250px;
      width: 100%;
      z-index: 0;
      // max-height: 80px;
      max-height: calc(~"100% - 250px");
      transform-origin: 50% 0%;
      // transition: all 0.15s linear;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      overflow: hidden;
      // background-color: transparent;
      &.show {
        opacity: 1;
        pointer-events: auto;
      }
      &.hide {
        opacity: 0;
        pointer-events: none;
      }
    }
  }
</style>