<template>
  <div class="media_fm_radio">
    <div class="media_fm_radio_header">电台直播</div>
    <div class="media_fm_radio_content">
      <div class="media_fm_radio_item">
        <span>地区</span>
        <Select v-model="currentPlace"
                style="width:200px"
                @on-change="changePlace">
          <Option v-for="item in place"
                  :value="item.id"
                  :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="media_fm_radio_channels">
        <div class="media_fm_radio_channel_item"
             v-for="(item, index) in channel"
             :key="index"
             :title="item.name">
          <div class="media_fm_radio_channel_item_inner"
               @click="play(item.streams[0].url, item.id)">
            <img :src="item.icon[0].url"
                 :alt="item.name">
          </div>
        </div>
      </div>
    </div>

    <!-- <video autoplay>
      <source src="http://ngcdn001.cnr.cn/live/zgzs/index.m3u8"
              type="application/x-mpegURL">
    </video> -->

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
import { Select, Option } from 'view-design'
import { ipcRenderer } from 'electron'
require('video.js/dist/video-js.min.css')
import videojs from 'video.js'
// import 'videojs-flash'
import '@videojs/http-streaming'
export default {
  name: 'MediaFmRadio',
  components: {
    Select, Option
  },
  data () {
    return {
      place: [
        {
          name: '国家',
          id: '3225'
        }
      ],
      channel: [],
      channelResolution: 'H',
      currentPlace: '3225',
      activeSource: {
        url: '',
        type: 'application/x-mpegURL'
      },
      player: null
    }
  },
  mounted () {
    this.getRadioData()
  },
  methods: {
    getRadioData () {
      let res = ipcRenderer.sendSync('fm-get-radio-by-place', {
        place: this.currentPlace
      })
      if (res.result_code == 0 && res.data) {
        this.place = res.data.place || [{
          name: '国家',
          id: '3225'
        }]
        this.channel = res.data.top || []
      } else {
        this.place = [{
          name: '国家',
          id: '3225'
        }]
        this.channel = res.data.top || []
      }
    },
    modifyUrl (id) {
      let idMap = {
        '1': '',
        '2': 'http://ngcdn002.cnr.cn/live/jjzs/index.m3u8'
      }
    },
    play (url, id) {
      this.activeSource.url = url
      this.initPlayer()
      console.log('play: ', url)
    },
    changePlace (id) {
      this.currentPlace = id
      this.getRadioData()
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
.media_fm_radio {
  width: 100%;
  height: 100%;
  .media_fm_radio_header {
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
  .media_fm_radio_content {
    width: 100%;
    height: calc(~"100% - 42px");
    overflow-x: hidden;
    overflow-y: auto;
    .media_fm_radio_item {
      width: 100%;
      height: 48px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
    }
    .media_fm_radio_channels {
      width: 100%;
      max-height: calc(~"100% - 48px");
      overflow-x: hidden;
      overflow-y: auto;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .media_fm_radio_channel_item {
        width: 150px;
        height: 150px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .media_fm_radio_channel_item_inner {
          width: 130px;
          height: 130px;
          background-color: #fff;
          cursor: pointer;
          img {
            width: 130px;
            height: 130px;
          }
        }
      }
    }
  }
}
</style>