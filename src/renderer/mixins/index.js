import { ipcRenderer } from 'electron'
export default {
  methods: {
    $goto (path) {
      ipcRenderer.send('navigate-to', {
        path: path
      })
    }
  }
}