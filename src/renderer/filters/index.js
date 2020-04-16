export function emphasizeFilter (text, filter) {
  console.log('emphasizeFilter: ', text, filter)
  let outHtml = ''
  let reg = new RegExp(filter, 'ig')
  outHtml = text.replace(reg, item => '<span class="emphasize">' + item + '</span>')
  return outHtml
}

export function capacityFilter (text) {
  let size = Number(text)
  if (size > 1024 * 1024 * 1024) {
    return parseFloat((size / (1024 * 1024 * 1024)).toFixed(2)) + ' GB'
  } else if (size > 1024 * 1024) {
    return parseFloat((size / (1024 * 1024)).toFixed(2)) + ' MB'
  } else if (size > 1024) {
    return parseFloat((size / 1024).toFixed(2)) + ' KB'
  } else {
    return size.toFixed(2) + ' B'
  }
}

export function timeFilter (text) {
  let time = Number(text)
  let hour = parseInt(time / (60 * 60))
  let minute = parseInt(time / 60)
  let second = parseInt(time % 60)
  if (hour <= 0) {
    return (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
  } else {
    return (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
  }
}

export function dateTimeFilter (ts, format = 'YYYY-MM-DD hh:mm:ss') {
  let now = new Date()
  now.setTime(Number(ts))
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  month = (month < 10 ? '0' + month : month)
  let date = now.getDate()
  date = (date < 10 ? '0' + date : date)

  let hour = now.getHours()
  hour = (hour < 10 ? '0' + hour : hour)
  let minute = now.getMinutes()
  minute = (minute < 10 ? '0' + minute : minute)
  let second = now.getSeconds()
  second = (second < 10 ? '0' + second : second)

  return format.replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', date)
    .replace('hh', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

export function msgTimeFilter (ts, format = 'YYYY-MM-DD hh:mm:ss') {
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
}
