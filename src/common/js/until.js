// // 洗牌函数: 传入一个数组, 并打乱
export function shuffle(list) {
  // 不更改原数组, 一定要来一个slice, 不然的还会指向原来的数组. 一旦更改影响到原来的数组中的顺序.
  let arr = list.slice()
  // 当前索引
  let currentIndex = arr.length - 1
  // 临时值
  let temporaryValue
  // 当前索引, 换来的随机索引
  let randomIndex

  // 只要现在还有元素没有进行计算
  for (;currentIndex > 0; currentIndex--) {
    // 从这个数组中计算出来, 一个索引用来和当前的这个索引交换位置
    randomIndex = Math.floor(Math.random() * currentIndex)
    // 开始我们的赋值过程
    temporaryValue = arr[currentIndex]
    arr[currentIndex] = arr[randomIndex]
    arr[randomIndex] = temporaryValue
  }

  return arr
}
