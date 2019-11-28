export function emphasizeFilter (text, filter) {
  console.log('emphasizeFilter: ', text, filter)
  let outHtml = ''
  let reg = new RegExp(filter, 'ig')
  outHtml = text.replace(reg, item => '<span class="emphasize">' + item + '</span>')
  return outHtml
}
