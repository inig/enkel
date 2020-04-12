<template>
  <div class="container">
    <code>
      <pre>
        {{JSON.stringify(groups, null, 2)}}
      </pre>
    </code>
    <Button @click="createGroup">创建群</Button>
  </div>
</template>

<script>
import { Button } from 'view-design'
import { ipcRenderer } from 'electron'
export default {
  name: 'ProfileGroup',
  components: {
    Button
  },
  data () {
    return {
      formData: {
        'group_name': '',
        'group_description': '',
        avatar: '',
        'is_limit': true
      },
      groups: []
    }
  },
  mounted () {
    ipcRenderer.on('im-get-groups-response', this.imGetGroupsResponse)
    this.getGroups()
  },
  methods: {
    createGroup () {
      this.formData['group_name'] = '群组' + (Math.floor(Math.random() * 100))
      ipcRenderer.send('im-create-group', this.formData)
    },
    getGroups () {
      ipcRenderer.send('im-get-groups')
    },
    imGetGroupsResponse (event, data) {
      if (data.code == 0) {
        // 获取成功
        this.groups = data.group_list
      } else {
        this.groups = []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>