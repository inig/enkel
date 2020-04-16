import { ipcRenderer } from 'electron'
const ERROR_MESSAGE = {
  '880001': '未知错误',
  '880002': '参数不合法',
  '880003': '非法内容格式',
  '880004': '非法内容格式',
  '880005': '文件不存在',
  '880006': '注册之前先退出',
  '880007': '被限制注册',
  '880008': 'msg_id 非法',
  '880101': 'appkey 不存在',
  '880102': '签名错误',
  '880103': '用户不存在',
  '880104': '密码错误',
  '880106': '签名过期',
  '880107': '已经是登录状态',
  '880109': '重复登录',
  '880110': '多通道错误，更新sdk版本',
  '880111': '用户被禁用',
  '880203': '目标用户不存在',
  '880204': '目标群组不存在',
  '880205': '用户不在群组',
  '880206': '消息大小超过限制',
  '880207': '用户被对方拉黑',
  '880208': '消息包含敏感词汇',
  '880209': '发送速度超过限制',
  '880210': '文件大小超过限制',
  '880212': '禁言中',
  '880402': '没有创建群组的权限',
  '880403': '群数量到达上限',
  '880404': '群名字超过长度限制，创建失败',
  '880405': '群描述长度超过限制',
  '880602': '目标为空',
  '880604': '没权限添加群成员',
  '880606': '成员列表中有用户没有被添加到群组的权限',
  '880607': '重复添加',
  '880608': '数量超过限制',
  '880609': '成员列表中存在成员的群组数量超过限制',
  '880610': '用户已经在群里面',
  '880611': '群类型不支持该操作',
  '880612': '已经处理',
  '880614': '无权限操作',
  '880704': '用户没有删除群成员的权限',
  '880705': '成员列表中存在成员用户没权限删除',
  '880903': '成员列表中有成员不能被添加，添加失败',
  '880904': '重复添加',
  '881101': '该成员已处于免打扰状态',
  '881102': '该成员不处于免打扰状态',
  '881105': '该群组已处于免打扰状态',
  '881106': '该群组不处于免打扰状态',
  '881107': '已经设置免打扰',
  '881108': '没有设置免打扰',
  '881203': '已经设置了屏蔽',
  '881204': '群未设置屏蔽',
  '881302': '已经是好友',
  '881303': '非好友关系',
  '881304': '非法备注',
  '881305': '添加好友失败：邀请事件无效',
  '881401': '超出撤回时间',
  '881402': '请求撤回方不是消息发送方',
  '881403': '消息不存在',
  '881404': '已经撤回',
  '881501': '用户不在聊天室',
  '881502': '用户被禁止发消息',
  '881503': '聊天室不存在',
  '881504': '消息长度超出限制',
  '881507': '用户已经在聊天室',
  '881508': '超过聊天室人数限制',
  '881509': '消息格式错误',
  '881602': '目标用户未登录',
  '881604': '消息长度超出限制',
  '881701': '用户不是群管理员',
  '882001': '系统内部错误',
  '882002': '操作失败',
  '882003': '参数不合法',
  '882004': '无效授权',
  '882005': '系统繁忙，稍后重试'
}
export default {
  methods: {
    $goto (data) {
      let opt = {
        path: data.name
      }
      if (data.meta) {
        if (data.meta.id) {
          opt.id = data.meta.id
        }
        if (data.meta.resources) {
          opt.resources = data.meta.resources
        }
        if (data.meta.loginBefore) {
          opt.loginBefore = data.meta.loginBefore
        }
        if (data.meta.windowOption) {
          opt.windowOption = data.meta.windowOption
        }
      }
      ipcRenderer.send('navigate-to', opt)
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
    },
    $timeFilter (text) {
      let time = Number(text)
      let hour = parseInt(time / (60 * 60))
      let minute = parseInt(time / 60)
      let second = parseInt(time % 60)
      if (hour <= 0) {
        return (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
      } else {
        return (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
      }
    },
    $msgTimeFilter (ts, format = 'YYYY-MM-DD hh:mm:ss') {
      let nowYear = (new Date()).getFullYear()
      let time = (new Date(ts))
      let year = time.getFullYear()
      let month = time.getMonth() + 1
      month = (month < 10 ? ('0' + month) : month)
      let date = time.getDate()
      date = (date < 10 ? ('0' + date) : date)
      let hour = time.getHours()
      hour = (hour < 10 ? ('0' + hour) : hour)
      let minute = time.getMinutes()
      minute = (minute < 10 ? ('0' + minute) : minute)
      let second = time.getSeconds()
      second = (second < 10 ? ('0' + second) : second)
      let _format = format
      if (nowYear == year) {
        _format = _format.replace(/(YYYY.)/, '')
      }
      return _format.replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', date)
        .replace('hh', hour)
        .replace('mm', minute)
        .replace('ss', second)
    },
    $initLoginInfo () {
      let loginInfo = ipcRenderer.sendSync('init-login-info')
      return loginInfo
    },
    $getParamsFromUrl (url) {
      let params = {}
      if (url.indexOf('?') > 0) {
        let paramStr = url.replace(/^([^?]*)(\?)([^/#]*)(\/?\#?.*)$/, '$3')
        params = paramStr.split('&').reduce((result, item) => {
          result[item.split('=')[0]] = item.split('=')[1]
          return result
        }, {})
      }
      return params
    },
    $createFileFormData (file) {
      var fd = new FormData();
      fd.append(file.name, file);
      return fd;
    },
    $translateErrorCode (code) {
      return ERROR_MESSAGE[String(code)] || '操作失败，请稍后再试'
    }
  }
}