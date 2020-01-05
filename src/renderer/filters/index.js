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
