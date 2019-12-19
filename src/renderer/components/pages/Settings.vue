<template>
  <div class="settings_container">
    <div class="settings_items">
      <div class="settings_item_content">
        <Form :label-width="80"
              style="padding-bottom: 1px;">
          <FormItem label="当前版本">
            <div class="version_container">
              <span class="current_version">v{{pkg.version}}</span>
              <div class="new_version"
                   key="latestVersion1"
                   v-if="hasNewVersion">
                可更新至: <span style="margin-left: 4px; color: green;">v{{latestVersion}}</span>
                <Button type="success"
                        size="small"
                        ghost
                        :loading="upgradeStatus === 'DOWNLOADING' || upgradeStatus === 'INSTALLING'"
                        @click="upgrade">
                  <span v-if="upgradeStatus === 'NORMAL'">{{downloadProgress > 0 ? '继续升级' : '立即升级'}}</span>
                  <span v-else-if="upgradeStatus === 'DOWNLOADING'">下载中...</span>
                  <span v-else-if="upgradeStatus === 'DOWNLOADED'">下载完成,点击安装</span>
                  <span v-else-if="upgradeStatus === 'INSTALLING'">安装中...</span>
                  <span v-else-if="upgradeStatus === 'INSTALLED'">安装完成</span>
                  <span v-else>立即升级</span>
                </Button>
              </div>
              <div class="new_version"
                   style="color: green;"
                   key="latestVersion2"
                   v-if="!hasNewVersion">已经是最新版本</div>
            </div>
          </FormItem>
          <FormItem label="版本更新"
                    v-if="hasNewVersion">
            <Progress :percent="downloadProgress"
                      :stroke-color="progressColor"
                      status="active">
              <span style="width: 60px; display: flex; flex-direction: row; align-items: center; justify-content: center;">{{receivedBytes | capacityFilter}}</span><span> / </span><span style="width: 60px; display: flex; flex-direction: row; align-items: center; justify-content: center;">{{totalBytes | capacityFilter}}</span>
            </Progress>
          </FormItem>

          <FormItem label="暂停下载"
                    v-if="hasNewVersion">
            <Button type="primary"
                    :disabled="upgradeStatus !== 'DOWNLOADING'"
                    @click="cancelDownload">暂停</Button>
          </FormItem>
          <FormItem label="清除缓存">
            <Button type="primary"
                    :disabled="upgradeStatus === 'DOWNLOADING' || upgradeStatus === 'INSTALLING'"
                    @click="removeDownloadInfo">清除</Button>
          </FormItem>
          <FormItem label=""
                    :label-width="0">
            <div style="width: 100%; height: 1px; background-color: #eee;"></div>
          </FormItem>
          <FormItem label="全局快捷键"
                    :label-width="90"
                    class="table_header"></FormItem>
          <FormItem :label-width="0">
            <Table :columns="globalShortcutsColumns"
                   :data="globalShortcuts"
                   border></Table>
          </FormItem>

          <FormItem label="局部快捷键"
                    :label-width="90"
                    class="table_header"></FormItem>
          <FormItem :label-width="0">
            <Table :columns="globalShortcutsColumns"
                   :data="shortcuts"
                   border></Table>
          </FormItem>
        </Form>
      </div>
      <!-- <div class="settings_item_title">
        快捷键设置
      </div>
      <div class="settings_item_content">
        <Form :label-width="130">
          <FormItem label="识别屏幕中二维码">
            <Input placeholder="快捷键"
                   :value="qrcodeShortcut"
                   @on-keydown="changeShortcutKey" />
          </FormItem>
        </Form>
      </div> -->
    </div>
  </div>
</template>

<script>
  import { Form, FormItem, Input, Progress, Button, Table } from 'view-design'
  import { ipcRenderer } from 'electron'
  const pkg = require('../../../../package.json')
  export default {
    name: 'Settings',
    components: {
      Form, FormItem, Input, Progress, Button, Table
    },
    data () {
      return {
        qrcodeShortcut: '',
        downloadProgress: 0,
        progressColor: ['#50D5B7', '#067D68'],
        pkg: pkg,
        latestVersion: '0.0.1',
        receivedBytes: 0,
        totalBytes: 0,
        upgrading: false, // 正在升级中
        upgradeStatus: 'NORMAL', // NORMAL: 正常状态；DOWNLOADING: 下载中； DOWNLOADED: 下载完成；INSTALLING: 安装中；INSTALLED: 安装完成
        globalShortcuts: [
          {
            title: '打开/关闭菜单',
            value: 'Command + Shift + S'
          },
          {
            title: '识别屏幕中二维码',
            value: 'Command + Shift + E'
          }
        ],
        shortcuts: [
          {
            title: '打开设置面板',
            value: 'Command + ,'
          }
        ],
        globalShortcutsColumns: [
          {
            title: '命令',
            key: 'title'
          },
          {
            title: '快捷键',
            key: 'value',
            width: 190,
            align: 'center'
          }
        ]
      }
    },
    computed: {
      hasNewVersion () {
        let v1 = Number(this.pkg.version.replace(/(\d{1,}\.)/g, item => { if (Number(item) < 10) { return '0' + item } else { return item } }).replace(/\./g, ''))
        let v2 = Number(this.latestVersion.replace(/(\d{1,}\.)/g, item => { if (Number(item) < 10) { return '0' + item } else { return item } }).replace(/\./g, ''))
        return v1 < v2
      }
    },
    mounted () {
      // ipcRenderer.on('update-download-progress', this.updateDownloadProgress)
      ipcRenderer.send('get-latest-version')
      // this.initDownloadingProgress()
      ipcRenderer.send('init-downloading-progress')

      ipcRenderer.send('get-upgrade-status')
      this.upgrade()

      ipcRenderer.on('upgrade-response', this.upgradeHandler)
      ipcRenderer.on('response-latest-version', this.initVersion)
      ipcRenderer.on('response-downloading-progress', this.initDownloadingProgress)
    },
    methods: {
      changeShortcutKey (e) {
        console.log(e.key)
        if (e.key === 'Backspace') {
          this.qrcodeShortcut = ''
        } else {
          this.qrcodeShortcut = (!this.qrcodeShortcut ? '' : ' + ') + this.qrcodeShortcut
        }
      },
      updateDownloadProgress (event, data) {
        this.receivedBytes = data.receivedBytes
        this.totalBytes = data.totalBytes
        this.downloadProgress = parseFloat((data.receivedBytes / data.totalBytes * 100).toFixed(2))
      },
      initVersion (event, data) {
        this.latestVersion = data.version
      },
      initDownloadingProgress (event, data) {
        // let initProgress = ipcRenderer.sendSync('init-downloading-progrress')
        this.receivedBytes = data.receivedBytes
        this.totalBytes = data.totalBytes
        if (data.totalBytes == 0) {
          this.downloadProgress = 0
        } else {
          this.downloadProgress = parseFloat((data.receivedBytes / data.totalBytes * 100).toFixed(2))
        }
      },
      upgrade () {
        if (this.hasNewVersion) {
          if (this.upgradeStatus === 'NORMAL') {
            // this.upgrading = true
            ipcRenderer.send('upgrade')
          } else if (this.upgradeStatus === 'DOWNLOADED') {
            ipcRenderer.send('install', {
              version: this.latestVersion
            })
          }
        }
      },
      upgradeHandler (event, data) {
        this.upgradeStatus = data.status.toUpperCase()
        this.receivedBytes = data.receivedBytes
        this.totalBytes = data.totalBytes
        if (data.status === 'downloading') {
          // 正在下载中
          this.downloadProgress = parseFloat((data.receivedBytes / data.totalBytes * 100).toFixed(2))
        } else if (data.status === 'downloaded') {
          // 下载完成
          // 去安装
          this.downloadProgress = 100
        }
      },
      removeDownloadInfo () {
        ipcRenderer.send('remove-download-info')
        this.downloadProgress = 0
        this.receivedBytes = 0
        this.totalBytes = 0
      },
      cancelDownload () {
        ipcRenderer.send('cancel-download')
        this.upgradeStatus = 'NORMAL'
      }
    }
  }
</script>

<style lang="less" scoped>
  .settings_container {
    overflow-x: hidden;
    overflow-y: auto;
    padding-top: 15px;
    box-sizing: border-box;
    .settings_item_title {
      position: sticky;
      width: 100%;
      height: 32px;
      left: 0;
      top: 0;
      border-bottom: 1px solid #f8f8f8;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 0 10px;
      box-sizing: border-box;
      background-color: #ffffff;
      color: #333;
    }
    .settings_item_content {
      width: 100%;
      padding: 0 15px;
      box-sizing: border-box;
      // background-color: #fafafa;

      .ivu-form-item {
        margin-bottom: 5px;
        margin-top: 5px;
      }
      .settings_item {
        width: 100%;
        height: 32px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
  .version_container {
    height: 34px;
    font-size: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .new_version {
      margin-left: 8px;
      display: flex;
      flex-direction: row;
      align-items: center;
      button {
        margin-left: 20px;
        font-size: 11px;
        display: flex;
        align-items: center;
        flex-direction: row;
      }
    }
  }
</style>