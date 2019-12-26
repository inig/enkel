<template>
  <div class="media_video">
    <video src="//vjs.zencdn.net/v/oceans.mp4"
           poster="//vjs.zencdn.net/v/oceans.png"
           class="video-js"
           controls
           preload="auto"
           id="my-player"
           data-setup='{}'></video>
  </div>
</template>

<script>
  export default {
    name: 'MediaVideo',
    created () {
      console.log(this.$route)
      this.preloadResources()
    },
    mounted () {
      // https://www.awaimai.com/2053.html
      var options = {};

      var player = videojs('my-player', options, function onPlayerReady () {
        videojs.log('Your player is ready!');

        // In this context, `this` is the player that was created by Video.js.
        this.play();

        // How about an event listener?
        this.on('ended', function () {
          videojs.log('Awww...over so soon?!');
        });
      });
    },
    methods: {
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

<style lang="less" scoped>
  .media_video {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>