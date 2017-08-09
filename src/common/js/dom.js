// 为某个元素添加类名
export function addClass(el, className) {
  // 有这个类名的话, 直接结束执行
  if (hasClass(el, className)) {
    return
  }
  // 直接添加className
  el.classList.add(className)
}

// 判断某个元素是否含有某个类名
export function hasClass(el, className) {
  // 创建正则进行判断
  // 开始, 或者是空白字符,  跟上类名, 最后是空白字符, 或者是直接结束
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  // 传入这个对象的类名即可 RegExpObject.test(string)
  // 如果字符串 string 中含有与 RegExpObject 匹配的文本，则返回 true，否则返回 false。
  return reg.test(el.className)
}