<template>
  <div class="about_container">
    <span class="appName">{{pkg.name.toUpperCase()}}</span> <span class="appVersion">v{{pkg.version}}</span>
    <pre class="author">
      {{pkg.author}}
    </pre>
  </div>
</template>

<script>
const pkg = require('../../../../package.json')
export default {
  name: 'About',
  data () {
    return {
      pkg: {}
    }
  },
  created () {
    this.pkg = pkg
  }
}
</script>

<style lang="less" scoped>
.about_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.author {
  margin-top: 10px;
  color: #c8c8c8;
}
.appVersion {
  color: #888;
}
</style>