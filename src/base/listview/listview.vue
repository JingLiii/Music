<template>
  <scroll 
    class="listview" 
    :data="data" 
    ref="listview"
    :listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="3"
  >
    <!-- 歌手左列表 -->
    <!-- 整个外层的一个嵌套, 例如热门是一块, a是一块 -->
    <ul>
      <li v-for="group in data" :key="group.title" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <!-- 里面的一块: 例如热面下面有哪些数据, a下面有哪些数据 -->
        <ul>
          <li v-for="item in group.items" :key="item.id" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 右侧关键字列表 -->  
    <!-- touchstart: 滑动开始 -->
    <!-- 滑动的时候, 需要阻止事件冒泡, 再阻止默认滚动. 因为上面的在滚动, 下面的也在, 容易选不中 -->
    <!-- 好吧, 其实我没有理解 -->
    <div 
      class="list-shortcut" 
      @touchmove.stop.prevent="onShortcutTouchMove" 
      @touchstart="onShortcutTouchStart"
    >
      <ul>
        <!-- 添加索引, 以便检查滑动到了第几个 -->
        <li 
          v-for="(item, index) in shortcutList" 
          :key="item" 
          :data-index="index" 
          class="item"
          :class="{'current':currentIndex===index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
// 现在我们的这个scroll组件是可以直接嵌套的, 嵌套后自己在其中直接形成一个滚动的空间
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'

// 定义每一个锚点的高度
const ANCHOR_HEIGHT = 18
export default {
  data () {
    return {
      // 在Y轴滚动的位置
      // 为什么要是-1. 不是0
      scrollY: -1,
      // 观察当前滚动到第几个了
      currentIndex: 0
    }
  },
  watch: {
    // 这个data 是在props中的data
    data () {
      // 数据发生改变的时候, 我开始延时计算DOM
      // 因为数据的变化 到dom的变化 会有个延时
      setTimeout(() => {
        // dom渲染好了, 我们就开始计算高度
        this._calculateHeight()
      }, 20)
    },
    // 检测, 我们的Y轴有没有滚动
    scrollY (newY) {
      // 对比scrollY对LishtHeight对比, 判断落在了第几个区间
      const listHeight = this.listHeight

      // 当滚动到顶部的时候
      if (newY > 0) {
        this.currentIndex = 0
        return
      }

      // 在中间部分滚动
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        // 如果最后一个数不见了,
        // 或者移动的时候, 落在了某个范围内
        // 我感觉这是 最神奇的一行代码了
        if (!height2 || (-newY > height1 && -newY < height2)) {
          // 就根据这个范围的i, 选择谁来特殊标记
          this.currentIndex = i
          return
        }
      }

      // 当滚动到底部, 且-newY大于最后一个元素的上线
      this.currentIndex = listHeight.length - 2
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  components: {
    Scroll
  },
  // 通过计算属性, 根据data中每一项中的title, 形成一个计算属性, 获取右侧关键字列表
  computed: {
    shortcutList() {
      // 返回data的一个遍历数组, 去掉第一项
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    }
  },
  created () {
    // 不在data中, 以为并不需要观测这个数据的变化
    this.touch = {}
    // 给个值, 然后让scroll组件监听滚动事件
    this.listenScroll = true
    // 给个每个group的高度值
    this.listHeight = []
  },
  methods: {
    // 鼠标已经点击的效果
    onShortcutTouchStart(event) {
      // 拿到我们滑动到了第几个元素的索引值
      let anchorIndex = getData(event.target, 'index')

      // 获取我们按下的时候, 按下的位置
      let firstTouch = event.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex

      // 让 srcoll 滚动到相应的位置
      this._scrollTo(anchorIndex)
      // this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 2000)
    },
    // 鼠标滑动时的效果
    onShortcutTouchMove(event) {
      // 拿到滑动的元素
      // 再次记录移动的值
      let firstTouch = event.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 计算出移动的偏移量, 也就知道 我们偏移了几个位置
      // | 0 : 表示向下取整, 相当于Math.floor
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      // 再根据开始的一个位置加上这些个位置
      // this.touch.anchorIndex: 这个属性是一个字符串, 需要变为数字
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    // 滚动方法
    scroll(pos) {
      // 检测实时滚动的位置
      this.scrollY = pos.y
    },
    // 移动到指定位置
    _scrollTo(index) {
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    // 计算group中的每个组的高度
    _calculateHeight() {
      // 首先清空每一个group的高度
      this.listHeight = []
      // 把页面中的每个group的dom元素做成一个数组赋值给list
      const list = this.$refs.listGroup
      // 默认第一个高度为0
      let height = 0
      this.listHeight.push(height)
      // 遍历这个group组, 吧每个dom元素的高度都放到一个数组中
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        // 每个高度都是累加的, 每累加一次, 就往数组中放一次
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable.stylus"
.listview
  position relative
  width 100%
  height 100%
  overflow hidden
  background-color $color-background
  .list-group
    padding-bottom 30px
    .list-group-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-l
      background-color $color-highlight-background
    .list-group-item
      display flex
      align-items center
      padding 20px 0 0 30px
      .avatar
        width 50px
        height 50px
        border-radius 50%
      .name
        margin-left 20px
        color $color-text-l
        font-size $font-size-medium
  .list-shortcut
    position absolute
    z-index 30
    right 0
    top 50%
    transform translateY(-50%)
    width 20px
    padding 20px 0px
    border-radius 10px
    background-color $color-background-d
    font-family Helvetica
    .item
      padding 3px
      line-height 1
      color $color-text-l
      font-size $font-size-small
      &.current
        color $color-theme
  .loading-container
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>

