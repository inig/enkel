/***
 **                                                          _ooOoo_
 **                                                         o8888888o
 **                                                         88" . "88
 **                                                         (| -_- |)
 **                                                          O\ = /O
 **                                                      ____/`---'\____
 **                                                    .   ' \\| |// `.
 **                                                     / \\||| : |||// \
 **                                                   / _||||| -:- |||||- \
 **                                                     | | \\\ - /// | |
 **                                                   | \_| ''\---/'' | |
 **                                                    \ .-\__ `-` ___/-. /
 **                                                 ___`. .' /--.--\ `. . __
 **                                              ."" '< `.___\_<|>_/___.' >'"".
 **                                             | | : `- \`.;`\ _ /`;.`/ - ` : | |
 **                                               \ \ `-. \_ __\ /__ _/ .-` / /
 **                                       ======`-.____`-.___\_____/___.-`____.-'======
 **                                                          `=---='
 **
 **                                       .............................................
 **                                              佛祖保佑             永无BUG
 **                                      佛曰:
 **                                              写字楼里写字间，写字间里程序员；
 **                                              程序人员写程序，又拿程序换酒钱。
 **                                              酒醒只在网上坐，酒醉还来网下眠；
 **                                              酒醉酒醒日复日，网上网下年复年。
 **                                              但愿老死电脑间，不愿鞠躬老板前；
 **                                              奔驰宝马贵者趣，公交自行程序员。
 **                                              别人笑我忒疯癫，我笑自己命太贱；
 **                                              不见满街漂亮妹，哪个归得程序员？
 */
/**
 * Created by liangshan on 2019/7/25.
 * Weex首页广告运营位
 */
import * as types from '../mutation-types'
import { ipcRenderer } from 'electron'
import '../../assets/js/jmessage-sdk-web.2.6.0.min.js'
let IM = null
function getFile (file) {
  console.log('>>>>>>>>>>>>>>', file)
  var fd = new FormData();
  fd.append(file.name, file);
  return fd;
}
const moduleIM = {
  namespaced: true,
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    imInitCheck () {
      return new Promise((resolve, reject) => {
        if (!IM || !IM.isInit()) {
          IM = new JMessage({
            debug: true
          })
          let imConfig = ipcRenderer.sendSync('im-get-config')
          IM.init(imConfig).onSuccess(data => {
            resolve(true)
          }).onFail(data => {
            reject(new Error('IM初始化失败' + (data.message ? (': ' + data.message) : '')))
          })
        } else {
          resolve(true)
        }
      })
    },
    init ({ dispatch }) {
      return new Promise(async (resolve, reject) => {
        await dispatch('imInitCheck').then(() => {
          resolve(true)
        }).catch(err => {
          reject(new Error(err.message))
        })
      })
    },
    imLoginCheck ({ dispatch }, args) {
      return new Promise(async (resolve, reject) => {
        await dispatch('imInitCheck').then(async () => {
          if (IM && IM.isLogin()) {
            // 已经登录
            resolve(true)
          } else {
            if (args) {
              IM.login(args).onSuccess(data => {
                // 收到新消息
                IM.onMsgReceive(data => {
                  ipcRenderer.send('im-on-msg-receive', data)
                })
                // 同步离线消息
                IM.onSyncConversation(data => {
                  ipcRenderer.send('im-on-sync-conversation', data)
                })
                // 聊天室消息监听
                IM.onRoomMsg(data => {
                  ipcRenderer.send('im-on-room-msg', data)
                })
                IM.onEventNotification(data => {
                  ipcRenderer.send('im-on-event-notification', data)
                })
                IM.onSyncEvent(data => {
                  ipcRenderer.send('im-on-sync-event', data)
                })
                resolve(true)
              }).onFail(data => {
                reject(new Error('IM登录失败' + (data.message ? ': ' + data.message : data.message)))
              })
            } else {
              reject('IM登录失败')
            }
          }
        }).catch(err => {
          reject(new Error('IM登录失败' + (err.message ? ': ' + err.message : err.message)))
        })
      })
    },
    login ({ dispatch }, args) {
      /**
       * username: 用户名
       * password: 密码
       * is_md5: 密码是否是 MD5 密码，true/false。默认false
       */
      return new Promise(async (resolve, reject) => {
        await dispatch('imLoginCheck', args).then(() => {
          resolve(true)
        }).catch(err => {
          reject(new Error(err.message))
        })
      })
    },
    loginOut ({ state }) {
      if (IM && IM.isLogin()) {
        IM.loginOut()
      }
    },
    register ({ state }, args) {
      /**
       * username: 用户名
       * password: 密码
       * is_md5: 密码是否是 MD5 密码，true/false。默认false
       * nickname: 昵称
       * birthday: 生日
       * signature: 签名
       * gender: 性别，0 未知, 1 男，2 女
       * region: 地区
       * address: 地址
       * extras: 自定义 json 格式字段
       * media_id: 头像 id
       */
      return new Promise(resolve => {
        IM.register(args).onSuccess(data => {
          resolve(data)
        }).onFail(data => {
          resolve(data)
        })
      })
    },
    sendSingleMsg ({ state }, args) {
      /**
       * target_username: 接收消息者 username
       * target_nickname: 接收消息者 nickname
       * content: 消息文本
       * extras: 附加字段,字典类型
       * need_receipt: 是否需要已读回执，需要:true 不需要:false
       */
      return new Promise((resolve, reject) => {
        IM.sendSingleMsg(args).onSuccess(data => {
          resolve(data)
        }).onFail(data => {
          reject(data)
        }).onTimeout(data => {
          reject(data)
        }).onAck(data => {
          reject(data)
        })
      })
    },
    getResourceUrl ({ }, args) {
      return new Promise(async (resolve, reject) => {
        if (args.id) {
          IM.getResource({ 'media_id': args.id }).onSuccess(data => {
            resolve(data)
          }).onFail(data => {
            reject(new Error('未找到资源' + (data.message ? ': ' + data.message : data.message)))
          })
        } else {
          reject(new Error('未找到资源'))
        }
      })
    },
    getUserInfo ({ dispatch }, args) {
      /**
       * username
       */
      return new Promise(async (resolve, reject) => {
        await dispatch('imLoginCheck').then(() => {
          IM.getUserInfo(args).onSuccess(async (data) => {
            let _data = JSON.parse(JSON.stringify(data))
            if (_data.code === 0 && _data.user_info && _data.user_info.avatar) {
              let resourceResponse = await dispatch('getResourceUrl', {
                id: _data.user_info.avatar
              })
              if (resourceResponse.code === 0) {
                _data.user_info.avatar = resourceResponse.url
              } else {
                _data.user_info.avatar = ''
              }
            }
            resolve(_data)
          }).onFail(data => {
            reject('获取个人信息失败' + (data.message ? ': ' + data.message : data.message))
          })
        }).catch(err => {
          reject(new Error(err.message))
        })
      })
    },
    updateSelfInfo ({ dispatch }, args) {
      /**
       * nickname: 昵称
       * birthday: 生日
       * signature: 签名
       * gender: 性别，0 未知, 1 男，2 女
       * region: 地区
       * address: 地址
       * extras: 自定义 json 格式字段
       */
      return new Promise(async (resolve, reject) => {
        await dispatch('imLoginCheck').then(() => {
          IM.updateSelfInfo(args).onSuccess(async (data) => {
            console.log('更新个人信息: ', data)
            let _data = JSON.parse(JSON.stringify(data))
            if (_data.code === 0 && _data.user_info && _data.user_info.avatar) {
              let resourceResponse = await dispatch('getResourceUrl', {
                id: _data.user_info.avatar
              })
              if (resourceResponse.code === 0) {
                _data.user_info.avatar = resourceResponse.url
              } else {
                _data.user_info.avatar = ''
              }
            }
            resolve(_data)
          }).onFail(data => {
            reject(new Error('更新个人信息失败' + (data.message ? ': ' + data.message : data.message)))
          })
        }).catch(err => {
          reject(new Error(err.message))
        })
      })
    },
    updateSelfAvatar ({ state }, args) {
      /**
       * avatar: 头像头像图片的 DataForm 对象
       */
      return new Promise((resolve, reject) => {
        console.log('@@@@@@上传', args)
        IM.updateSelfAvatar(args).onSuccess(data => {
          resolve(data)
        }).onFail(data => {
          reject(data)
        })
      })
    },
    updateSelfPwd ({ state }, args) {
      /**
       * old_pwd: 旧的密码
       * new_pwd: 新的密码
       * is_md5: 密码是否经过 MD5，true/false。 默认false
       */
      return new Promise((resolve, reject) => {
        IM.updateSelfPwd(args).onSuccess(data => {
          resolve(data)
        }).onFail(data => {
          reject(data)
        })
      })
    },
    onEventNotification ({ state }) {
      return new Promise(resolve => {
        IM.onEventNotification(data => {
          resolve(data)
        })
      })
    },
    onSyncEvent ({ state }) {
      return new Promise(resolve => {
        IM.onSyncEvent(data => {
          resolve(data)
        })
      })
    },
    /** 群组相关 */
    createGroup ({ state }, args) {
      /**
       * group_name: 群组名
       * group_description: 群组描述
       * avatar: 群头像图片的 DataForm 对象
       * is_limit: 是否是公开群,默认 false
       */
      return new Promise((resolve, reject) => {
        IM.createGroup(args).onSuccess(data => {
          resolve(data)
        }).onFail(data => {
          reject(data)
        })
      })
    },
    getGroups ({ state }) {
      return new Promise((resolve, reject) => {
        IM.getGroups().onSuccess(data => {
          resolve(data)
        }).onFail(data => {
          reject(data)
        })
      })
    },
    /** 群组相关 */
    /** 好友相关 */
    getFriendList ({ state }) {
      /**
       * 好友列表
       */
      return new Promise((resolve, reject) => {
        IM.getFriendList().onSuccess(data => {
          resolve(data)
        }).onFail(data => {
          reject(data)
        })
      })
    },
    addFriend ({ state }, args) {
      /**
       * 添加好友
       * target_name: 目标 username
       * why: 邀请说明
       */
      return new Promise((resolve, reject) => {
        IM.addFriend(args).onSuccess(data => {
          resolve(data)
        }).onFail(data => {
          reject(data)
        })
      })
    },
    acceptFriend ({ state }, args) {
      /**
       * 同意好友请求
       * target_name: 目标 username
       */
      return new Promise((resolve, reject) => {
        IM.acceptFriend(args).onSuccess(data => {
          resolve(data)
        }).onFail(data => {
          reject(data)
        })
      })
    },
    declineFriend ({ state }, args) {
      /**
       * 拒绝好友请求
       * target_name: 目标 username
       * why: 拒绝理由
       */
      return new Promise((resolve, reject) => {
        IM.declineFriend(args).onSuccess(data => {
          resolve(data)
        }).onFail(data => {
          reject(data)
        })
      })
    },
    delFriend ({ state }, args) {
      /**
       * 删除好友
       * target_name: 目标 username
       */
      return new Promise((resolve, reject) => {
        IM.delFriend(args).onSuccess(data => {
          resolve(data)
        }).onFail(data => {
          reject(data)
        })
      })
    },
    updateFriendMemo ({ state }, args) {
      /**
       * 更新好友备注
       * target_name: 目标 username
       * memo_name: 名称备注
       * memo_others: 其他备注
       */
      return new Promise((resolve, reject) => {
        IM.updateFriendMemo(args).onSuccess(data => {
          resolve(data)
        }).onFail(data => {
          reject(data)
        })
      })
    },
    /** 好友相关 */
  }
}

export default moduleIM
