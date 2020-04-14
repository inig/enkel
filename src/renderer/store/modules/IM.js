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
import md5 from 'blueimp-md5'
import '../../assets/js/jmessage-sdk-web.2.6.0.min.js'
let IM = new JMessage({
  debug: true
})
let loginInfo = ipcRenderer.sendSync('init-login-info')
// function IM_INIT () {
//   if (!IM.isInit()) {
//     let imConfig = ipcRenderer.sendSync('im-get-config')
//     IM.init(imConfig)
//   }
// }
// IM_INIT()

function getFile (file) {

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
    imInitCheck ({ dispatch }) {
      return new Promise(async (resolve, reject) => {
        resolve(IM && IM.isInit())
      })
    },
    doInit () {
      return new Promise((resolve, reject) => {
        let imConfig = ipcRenderer.sendSync('im-get-config')
        IM.init(imConfig).onSuccess(data => {

          resolve(data)
        }).onFail(data => {

          resolve(data)
        })
      })
    },
    init ({ dispatch }) {
      return new Promise(async (resolve, reject) => {

        if (!IM.isInit()) {
          // let imConfig = ipcRenderer.sendSync('im-get-config')
          await dispatch('doInit')
          resolve(true)

        } else {
          resolve(true)
        }
      })
    },
    imDoLogin ({ dispatch }, args) {
      return new Promise(async (resolve, reject) => {
        if (!IM.isInit()) {
          await dispatch('init')
        }
        if (IM.isInit() && !IM.isLogin()) {

          // 
          // resolve(data)
        } else {
          resolve(true)
        }
      })
    },
    imLoginCheck ({ dispatch }, args) {
      return new Promise((resolve, reject) => {
        resolve(IM && IM.isInit() && IM.isLogin())
      })
    },
    login ({ dispatch }, args) {
      /**
       * username: 用户名
       * password: 密码
       * is_md5: 密码是否是 MD5 密码，true/false。默认false
       */
      return new Promise(async (resolve, reject) => {
        if (!IM.isLogin()) {
          let _args = args
          if (!_args) {
            _args = {
              username: loginInfo.phonenum,
              password: md5(loginInfo.password)
            }
          }

          IM.login(Object.assign({}, _args, {
            is_md5: true
          })).onSuccess(data => {
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
              console.log('onEventNotification', data)
              ipcRenderer.send('im-on-event-notification', data)
            })
            IM.onSyncEvent(data => {
              ipcRenderer.send('im-on-sync-event', data)
            })
            resolve(data)
          }).onFail(data => {

            reject(data)
            // reject(new Error('IM登录失败' + (data.message ? ': ' + data.message : data.message)))
          })
        }
        // let _args = args
        // await dispatch('imDoLogin', _args).then(async () => {
        //   await dispatch('getUserInfo', {
        //     username: _args.username
        //   }).then(async (res) => {
        //     resolve(res)
        //   }).catch(err => {
        //     reject(err)
        //     // reject(new Error('头像更新失败' + (err.message ? (': ' + err.message) : err.message)))
        //   })
        // }).catch(async (err) => {
        //   if (err.code == 880103) {
        //     // 该用户未注册IM
        //     await dispatch('register', {
        //       username: _args.username,
        //       password: _args.password,
        //       nickname: _args.username,
        //       is_md5: true
        //     }).then(async () => {
        //       await dispatch('login', _args).then(async (res) => {
        //         resolve(res)
        //       }).catch(err => {
        //         reject(err)
        //         // reject(new Error('头像更新失败' + (err.message ? (': ' + err.message) : err.message)))
        //       })
        //     })
        //   } else {
        //     reject(new Error(err.message))
        //   }
        // })
      })
    },
    loginOut ({ state }) {
      if (IM && IM.isLogin()) {
        IM.loginOut()
      }
    },
    register ({ dispatch }, args) {
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
      return new Promise(async (resolve, reject) => {
        await dispatch('imInitCheck').then(async () => {
          IM.register(Object.assign({}, args, {
            is_md5: true
          })).onSuccess(data => {
            resolve(data)
          }).onFail(data => {
            resolve(data)
          })
        }).catch(err => {
          // reject(new Error(err.message))
          reject(err)
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
            reject(data)
            // reject(new Error('未找到资源' + (data.message ? ': ' + data.message : data.message)))
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
            reject(data)
            // reject(new Error('获取个人信息失败' + (data.message ? ': ' + data.message : data.message)))
          })
        }).catch(err => {
          reject(err)
          // reject(new Error(err.message))
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
            reject(data)
            // reject(new Error('更新个人信息失败' + (data.message ? ': ' + data.message : data.message)))
          })
        }).catch(err => {
          reject(err)
          // reject(new Error(err.message))
        })
      })
    },
    updateSelfAvatar ({ dispatch }, args) {
      /**
       * avatar: 头像头像图片的 DataForm 对象
       */
      return new Promise(async (resolve, reject) => {
        await dispatch('imLoginCheck').then(() => {
          IM.updateSelfAvatar(args).onSuccess(async (data) => {
            if (data.code === 0) {
              // 头像更新成功
              await dispatch('getUserInfo', {
                username: args.username
              }).then(async (res) => {
                resolve(res)
              }).catch(err => {
                reject(err)
                // reject(new Error('头像更新失败' + (err.message ? (': ' + err.message) : err.message)))
              })
            } else {
              reject(data)
              // reject(new Error('头像更新失败' + (data.message ? (': ' + data.message) : data.message)))
            }
          }).onFail(data => {
            reject(data)
            // reject(new Error('头像更新失败' + (data.message ? ': ' + data.message : data.message)))
          })
        }).catch(err => {
          reject(err)
          // reject(new Error(err.message))
        })
      })
    },
    updateSelfPwd ({ dispatch }, args) {
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
    onEventNotification ({ dispatch }) {
      return new Promise(resolve => {
        IM.onEventNotification(data => {
          resolve(data)
        })
      })
    },
    onSyncEvent ({ dispatch }) {
      return new Promise(resolve => {
        IM.onSyncEvent(data => {
          resolve(data)
        })
      })
    },
    /** 群组相关 */
    createGroup ({ dispatch }, args) {
      /**
       * group_name: 群组名
       * group_description: 群组描述
       * avatar: 群头像图片的 DataForm 对象
       * is_limit: 是否是公开群,默认 false
       */
      return new Promise(async (resolve, reject) => {
        await dispatch('imLoginCheck').then(() => {
          IM.createGroup(args).onSuccess(data => {
            resolve(data)
          }).onFail(data => {
            reject(data)
          })
        }).catch(err => {
          reject(err)
          // reject(new Error(err.message))
        })
      })
    },
    getGroups ({ dispatch }) {
      return new Promise(async (resolve, reject) => {
        await dispatch('imLoginCheck').then(() => {
          IM.getGroups().onSuccess(data => {
            resolve(data)
          }).onFail(data => {
            reject(data)
          })
        }).catch(err => {
          reject(err)
          // reject(new Error(err.message))
        })
      })
    },
    /** 群组相关 */
    /** 好友相关 */
    getFriendList ({ dispatch }) {
      /**
       * 好友列表
       */
      return new Promise(async (resolve, reject) => {
        await dispatch('imLoginCheck').then(() => {

          IM.getFriendList().onSuccess(data => {
            resolve(data)
          }).onFail(data => {
            reject(data)
          })
        }).catch(err => {

          reject(err)
          // reject(new Error(err.message))
        })
      })
    },
    addFriend ({ dispatch }, args) {
      /**
       * 添加好友
       * target_name: 目标 username
       * why: 邀请说明
       */
      return new Promise(async (resolve, reject) => {
        await dispatch('imLoginCheck').then(() => {
          IM.addFriend(args).onSuccess(data => {
            resolve(data)
          }).onFail(data => {
            reject(data)
          })
        }).catch(err => {
          reject(err)
          // reject(new Error(err.message))
        })
      })
    },
    acceptFriend ({ dispatch }, args) {
      /**
       * 同意好友请求
       * target_name: 目标 username
       */
      return new Promise(async (resolve, reject) => {
        await dispatch('imLoginCheck').then(() => {
          IM.acceptFriend(args).onSuccess(data => {
            resolve(data)
          }).onFail(data => {
            reject(data)
          })
        }).catch(err => {
          reject(err)
          // reject(new Error(err.message))
        })
      })
    },
    declineFriend ({ dispatch }, args) {
      /**
       * 拒绝好友请求
       * target_name: 目标 username
       * why: 拒绝理由
       */
      return new Promise(async (resolve, reject) => {
        await dispatch('imLoginCheck').then(() => {
          IM.declineFriend(args).onSuccess(data => {
            resolve(data)
          }).onFail(data => {
            reject(data)
          })
        }).catch(err => {
          reject(err)
          // reject(new Error(err.message))
        })
      })
    },
    delFriend ({ dispatch }, args) {
      /**
       * 删除好友
       * target_name: 目标 username
       */
      return new Promise(async (resolve, reject) => {
        await dispatch('imLoginCheck').then(() => {
          IM.delFriend(args).onSuccess(data => {
            resolve(data)
          }).onFail(data => {
            reject(data)
          })
        }).catch(err => {
          reject(err)
          // reject(new Error(err.message))
        })
      })
    },
    updateFriendMemo ({ dispatch }, args) {
      /**
       * 更新好友备注
       * target_name: 目标 username
       * memo_name: 名称备注
       * memo_others: 其他备注
       */
      return new Promise(async (resolve, reject) => {
        await dispatch('imLoginCheck').then(() => {
          IM.updateFriendMemo(args).onSuccess(data => {
            resolve(data)
          }).onFail(data => {
            reject(data)
          })
        }).catch(err => {
          reject(err)
          // reject(new Error(err.message))
        })
      })
    },
    /** 好友相关 */
  }
}

export default moduleIM
