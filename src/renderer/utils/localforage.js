import localforage from 'localforage'

export const SurveyStore = localforage.createInstance({
  name: 'enkel',
  storeName: 'survey'
})

function getLocalforageKey (args) {
  /**
   * key: localforage前置key
   * expiredAt: localforage失效时间，不传expiredAt或(expiredAt为0)时，不失效
   */
  if (args.expiredAt) {
    return args.key + '-' + (new Date()).getTime() + ':' + args.expiredAt
  } else {
    return args.key
  }
}

export function isExpired (args) {
  let key = args.key
  let matched = key.match(/\d{13}:\d{1,}$/)
  if (!matched) {
    // 无过期时间，永不失效
    return false
  } else {
    let _startTs = matched[0].split(':')[0]
    let _expiredAt = matched[0].split(':')[1]
    if (Number(_startTs) + Number(_expiredAt) <= (new Date()).getTime()) {
      // 缓存过期，删除缓存
      if (args.store) {
        args.store.removeItem(key)
      }
      return true
    } else {
      return false
    }
  }
}

function findRealKey (args) {
  return new Promise(async (resolve) => {
    if (!args.store) {
      resolve('')
    } else if (!args.key) {
      resolve('')
    } else {
      await args.store.keys().then(keys => {
        resolve(keys.filter(item => item.indexOf(args.key) === 0))
      }).catch(err => {
        resolve([])
      })
    }
  })
}

export function getItem (args) {
  return new Promise(async (resolve, reject) => {
    if (!args.store) {
      // reject(new Error('数据仓库 [store] 不能为空'))
      resolve(null)
    } else if (!args.key) {
      // reject(new Error('缓存名称 [key] 不能为空'))
      resolve(null)
    } else {
      let _localedKey = await findRealKey(args)
      if (_localedKey && _localedKey[0]) {
        let _isExpired = isExpired({
          key: _localedKey[0],
          store: args.store
        })
        if (_isExpired) {
          resolve(null)
        } else {
          let d = await args.store.getItem(_localedKey[0])
          resolve(d)
        }
      } else {
        resolve(null)
      }
    }
  })
}

export function setItem (args) {
  return new Promise(async (resolve, reject) => {
    if (!args.store) {
      reject(new Error('数据仓库 [store] 不能为空'))
    } else if (!args.key) {
      reject(new Error('缓存名称 [key] 不能为空'))
    } else {
      await removeItem(args)
      let _realKey = getLocalforageKey({
        key: args.key,
        expiredAt: args.expiredAt
      })
      await args.store.setItem(_realKey, args.data)
      resolve(true)
    }
  })
}

export function removeItem (args) {
  return new Promise(async (resolve, reject) => {
    if (!args.store) {
      reject(new Error('数据仓库 [store] 不能为空'))
    } else if (!args.key) {
      reject(new Error('缓存名称 [key] 不能为空'))
    } else {
      let _localedKey = await findRealKey(args)
      if (_localedKey) {
        _localedKey.forEach(item => {
          args.store.removeItem(item)
        })
      }
      resolve(true)
    }
  })
}
