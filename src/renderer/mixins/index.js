import { ipcRenderer } from 'electron'
export default {
  methods: {
    $goto (data) {
      ipcRenderer.send('navigate-to', data)
    },
    S4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
    getUUID (perfix) {
      return ((perfix ? (perfix + '-') : '') + this.S4() + '-' + this.S4())
    },
    $loadCss (path) {
      if (!path || path.length === 0) {
        throw new Error('argument "path" is required !');
      }
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.href = path;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      head.appendChild(link);
    },
    $loadJs (path) {
      if (!path || path.length === 0) {
        throw new Error('argument "path" is required !');
      }
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.src = path;
      script.type = 'text/javascript';
      head.appendChild(script);
    }
  }
}