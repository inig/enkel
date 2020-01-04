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

    <!-- <transition name="fade">
      <div class="fm_container"
           v-if="fmShown">
        <div class="fm_header">Enkel电台</div>
        <div class="fm_content fm_list_content">
          <div class="recommend_container">
            <swiper :options="swiperOptionTop"
                    class="gallery-top"
                    ref="swiperTop">
              <swiper-slide v-for="(item, index) in fmData.recommend"
                            :key="item.id"
                            :data-tag="item.title"
                            :data-index="index"
                            :style="{backgroundImage: 'url(' + item.cover + ')'}"></swiper-slide>
            </swiper>
          </div>
          <div class="category_container">
            <div style="width: 100%; height: 48px; background-color: #c8c8c8; padding: 15px; box-sizing: border-box;">
              <div style="width: 100%; max-width: 1000px; height: 100%; border-bottom: 1px solid #f5f5f5;">
                <div style="padding: 0 8px; border-bottom: 3px solid #f0f0f0; box-sizing: border-box; font-size: 16px;">精选目录</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="fm_list_container"
         :class="[fmListShown ? 'shown' : 'hidden']">
      <div class="fm_list_inner"
           @click.stop="noop">
        <div class="fm_list_header">
          {{fmListData.title}}
          <div class="fm_list_header_back"
               @click="hideFmList">
            <svg>
              <use xlink:href="#back"></use>
            </svg>
          </div>
        </div>
        <div class="fm_list_content">
          <div class="fm_list_content_inner">
            <div class="fm_list_content_item"
                 v-for="(item, index) in fmListData.list"
                 :key="index"
                 @click="playFm(item)">
              <div class="fm_list_content_item_img_wrapper">
                <div class="fm_list_content_item_img"
                     :style="{backgroundImage: 'url(' + item.cover + ')'}">
                </div>
              </div>
              <div class="fm_list_content_item_text">{{item.title}}</div>
            </div>

            <div class="fm_list_content_item empty"
                 v-for="(item, index) in Array((4 - fmListData.list.length % 12 % 4)).fill({})"
                 :key="'empty' + index">
              <div class="fm_list_content_item_img"></div>
              <div class="fm_list_content_item_text"></div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { Input, Button } from 'view-design'
require('video.js/dist/video-js.min.css')
import videojs from 'video.js'
import 'videojs-flash'
import '@videojs/http-streaming'
// import { swiper, swiperSlide } from 'vue-awesome-swiper'
// import 'swiper/dist/css/swiper.css'
export default {
  name: 'MediaVideo',
  components: {
    Input, Button,
    // swiper, swiperSlide
  },
  data () {
    return {
      videoSrc: '',
      player: null,
      playlist: [],
      activePlaylist: [4, 2],
      playlistShown: false,
      playFileShown: false,
      fmShown: true,
      canPlay: false,
      code: '',
      videoFile: null,
      fmData: {
        recommend: [],
        category: []
      },
      pageIndex: 1,
      pageSize: 20,
      fmListShown: true,
      fmListData: {
        title: '',
        list: []
      },
      currentFm: null,
      // https://swiperjs.com/api/#initialize
      swiperOptionTop: {
        // spaceBetween: 10,
        // loop: true,
        // loopedSlides: 3, //looped slides should be the same
        // navigation: {
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev'
        // }
        // loop: true,
        autoplay: {
          delay: 5000,
        },
        lazy: {
          loadPrevNext: true,
        },
        // slideToClickedSlide: true,
        speed: 500,
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 300,
          modifier: 3,
          slideShadows: true
        },
        pagination: {
          el: '.swiper-pagination'
        }
      },
      currentSlideIndex: 0
    }
  },
  computed: {
    activeSource () {
      // if (this.currentFm) {
      //   return {
      //     url: this.currentFm.url,
      //     label: this.currentFm.title,
      //     type: 'audio/mp3'
      //   }
      // } else 
      if (this.videoFile) {
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

      // const swiperTop = this.$refs.swiperTop.swiper
      // swiperTop.on('click', (event) => {
      //   let clickedIndex = Number(event.target.dataset.index)
      //   if (clickedIndex === this.currentSlideIndex) {
      //     this.getFmRecommendDetail(event.target.dataset.tag)
      //   } else {
      //     swiperTop.slideTo(clickedIndex)
      //   }
      // })
      // swiperTop.on('slideChange', (event) => {
      //   this.currentSlideIndex = Number(swiperTop.realIndex)
      // })
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
        // that.addItemFm()

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
    hideFm () {
      this.fmShown = false
    },
    showFm () {
      this.fmShown = true
    },
    toggleFm () {
      this.fmShown = !this.fmShown
    },
    hideFmList () {
      this.fmListShown = false
    },
    showFmList () {
      this.fmListShown = true
    },
    toggleFmList () {
      this.fmListShown = !this.fmListShown
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
    addItemFm () {
      const that = this
      let playlistEle = document.createElement('div')
      !playlistEle.classList.contains('video_control_item') && playlistEle.classList.add('video_control_item')
      playlistEle.setAttribute('title', '电台')
      playlistEle.onclick = () => {
        that.toggleFm()
      }
      let playlistImgEle = document.createElement('img')
      playlistImgEle.setAttribute('src', 'data:image/png;base64,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')
      playlistImgEle.style.width = '18px'
      playlistImgEle.style.height = '18px'
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
    getFmHomeList () {
      let fmHomeListData = ipcRenderer.sendSync('get-fm-home-list')
      if (fmHomeListData.code === 0 && fmHomeListData.data) {
        this.fmData = {
          recommend: fmHomeListData.data.tuijian,
          category: fmHomeListData.data.category
        }
      } else { }
    },
    getFmRecommendDetail (t) {
      let tag = t || '抑郁症是条黑狗'
      let detail = ipcRenderer.sendSync('get-fm-recommend-detail', {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        tag: tag
      })
      this.fmListData = {
        title: tag,
        list: detail.data || []
      }
      this.showFmList()
    },
    playFm (item) {
      console.log('.>>>>>>>>>', item)
      this.videoFile = null
      this.currentFm = item
      this.activePlaylist = [-1, -1]
      setTimeout(() => {
        this.initPlayer()
      }, 100)
    }
  },
  watch: {
    canPlay (val) {
      if (val) {
        setTimeout(() => {
          this.initPlayer()
        }, 300)
      }
    },
    fmShown: {
      immediate: true,
      handler (val) {
        if (val) {
          this.getFmHomeList()
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
  overflow: hidden;
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

  .fm_container {
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    .fm_header {
      width: 100%;
      height: 48px;
      background-color: #c02414;
      color: #fff;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .fm_content {
      width: 100%;
      // max-width: 1000px;
      height: calc(~"100% - 48px");
      margin: 0 auto;
      overflow-x: hidden;
      overflow-y: auto;
      .recommend_container {
        position: relative;
        width: 100%;
        height: 250px;
        -webkit-app-region: none;
      }
      .swiper-container {
        // background-color: #000;
        // display: flex;
        // flex-direction: row;
        // align-items: center;
        height: 250px;
      }
      .gallery-thumbs {
        .swiper-slide {
          background-size: cover;
          background-position: center;
        }
      }
      .gallery-top {
        .swiper-slide {
          // background-size: contain;
          // background-position: center;
          // background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          // width: 60%;
          width: 600px;
          height: 220px;
          margin-top: 15px;
          border-radius: 4px;
          box-shadow: 0 0 10px 1px #000;
        }
      }
    }
  }

  .fm_list_container {
    position: absolute;
    left: 0;
    transition: top 0.5s ease-in-out;
    width: 100%;
    height: 100%;
    z-index: 2;
    .fm_list_inner {
      position: absolute;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 0 0 15px 0;
      transition: top 0.5s ease-in-out;
      box-sizing: border-box;
      background-color: #fff;
    }
    &.shown {
      top: 0;
      .fm_list_inner {
        top: 0;
      }
    }
    &.hidden {
      top: 100%;
      .fm_list_inner {
        top: 100%;
      }
    }
    .fm_list_header {
      position: relative;
      width: 100%;
      height: 48px;
      background-color: #c02414;
      color: #fff;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 500;
      .fm_list_header_logo {
        position: absolute;
        left: 10px;
        bottom: 4px;
      }
      .fm_list_header_back {
        width: 48px;
        height: 48px;
        position: absolute;
        left: 65px;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        // bottom: 8px;
        svg {
          width: 14px;
          height: 14px;
          fill: #fff;
        }
      }
    }
    .fm_list_content {
      width: 100%;
      height: calc(~"100% - 48px");
      padding-top: 15px;
      box-sizing: border-box;
      overflow: auto;
      .fm_list_content_inner {
        width: 100%;
        max-width: 1000px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        margin: 0 auto;
        .fm_list_content_item {
          width: 25%;
          min-width: 200px;
          height: 240px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .fm_list_content_item_img_wrapper {
            width: 180px;
            height: 180px;
            border: 1px solid #c8c8c8;
            overflow: hidden;
          }
          .fm_list_content_item_img {
            width: 180px;
            height: 180px;
            cursor: pointer;
            background-size: cover;
            background-position: center;
            transform: scale(1);
            transition: transform 0.3s ease-in-out;
            &:hover {
              transform: scale(1.2);
            }
          }
          .fm_list_content_item_text {
            width: 180px;
            height: 60px;
            margin-top: 6px;
            display: flex;
            flex-direction: row;
          }
          &.empty {
            height: 1px;
            .fm_list_content_item_img {
              border: none !important;
            }
          }
        }
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