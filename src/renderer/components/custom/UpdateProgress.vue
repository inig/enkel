<template>
  <div class="update_progress_container"
       v-if="showUpdater">
    <div class="update_progress_inner">
      <p>{{'当前:' + downloadProcess.transferred + ' / 共' + downloadProcess.total}}</p>
      <el-progress :text-inside="true"
                   :stroke-width="18"
                   :percentage="downloadProcess.percent"></el-progress>
      <p>正在下载({{downloadProcess.speed}})...</p>
    </div>
  </div>
</template>

<script>
  const { ipcRenderer } = require('electron')
  export default {
    name: 'UpdateProgress',
    data () {
      return {
        showUpdater: false,
        downloadProgress: null
      }
    },
    created () {
      // 发现新版本
      ipcRenderer.once('autoUpdater-canUpdate', (event, info) => {
        this.$confirm(`发现有新版本【v${info.version}】，是否更新?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ipcRenderer.send('autoUpdater-toDownload')
        })
      })
      // 下载进度
      ipcRenderer.on('autoUpdater-progress', (event, process) => {
        if (process.transferred >= 1024 * 1024) {
          process.transferred = (process.transferred / 1024 / 1024).toFixed(2) + 'M'
        } else {
          process.transferred = (process.transferred / 1024).toFixed(2) + 'K'
        }
        if (process.total >= 1024 * 1024) {
          process.total = (process.total / 1024 / 1024).toFixed(2) + 'M'
        } else {
          process.total = (process.total / 1024).toFixed(2) + 'K'
        }
        if (process.bytesPerSecond >= 1024 * 1024) {
          process.speed = (process.bytesPerSecond / 1024 / 1024).toFixed(2) + 'M/s'
        } else if (process.bytesPerSecond >= 1024) {
          process.speed = (process.bytesPerSecond / 1024).toFixed(2) + 'K/s'
        } else {
          process.speed = process.bytesPerSecond + 'B/s'
        }
        process.percent = process.percent.toFixed(2)
        this.downloadProcess = process
        this.showUpdater = true
      })
      // 下载更新失败
      ipcRenderer.once('autoUpdater-error', (event) => {
        this.$message.error('更新失败！')
        this.showUpdater = false
      })
      // 下载完成
      ipcRenderer.once('autoUpdater-downloaded', () => {
        this.$confirm(`更新完成，是否关闭应用程序安装新版本?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ipcRenderer.send('exit-app')
        })
      })
    }
  }
</script>

<style lang="less" scoped>
  .update_progress_container {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .update_progress_inner {
    width: 300px;
    height: 150px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>