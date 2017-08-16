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

// 获取某个元素的属性值
// 有则获取, 无则添加
// element: 元素,  name: 属性名,  val: 属性值
export function getData(element, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) { // 传入了属性值, 就是设置
    // 这种return的写法, 只是为了返回一个返回值, 如果后面的语句没有返回值的话, 那么就是执行完整个语句不再执行
    return element.setAttribute(name, val)
  } else {  // 没有传入属性值, 就是获取整个属性值
    return element.getAttribute(name)
  }
}