import originJSONP from 'jsonp'

// 返回jsop调用函数, 并将参数分开盛放
export default function jsonp(url, data, option) {
  // 将data数据拼接到url中
  // 需要判断url中是否包含 ?
  // 没有的话 indexOf 返回 -1.  就会拼接一个 '?'
  // 有的话, 直接就开始拼接 '&'
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// 默认参数只有一层
function param (data) {
  // 定义拼接后的整个字符串
  let str = ''
  // 循环遍历data, 并用&进行拼接
  for (let k in data) {
    // 因为属性值可能为空, 会读成undefiend, 故变成 空字符串, 以免发送错误数据
    let value = data[k] !== undefined ? data[k] : ''
    // 使用ES6的模板语法进行字符串拼接
    // encodeURI: 会对整个URL进行转码, 不会对用于分割URL的特殊字符进行转码, 适用于URL跳转的转码.
    // encodeURIComponent: 同样进行转码, 同时会转码分割URL组件的特殊字符, 适用于URL参数的转码. 也就是对某个属性值进行转码
    str += `&${k}=${encodeURIComponent(value)}`
  }
  // 看下有没有内容
  // 有内容的话, 去掉第一个字符 '&'
  // 没有内容的话, 返回一个空字符串
  return str ? str.substring(1) : ''
}
