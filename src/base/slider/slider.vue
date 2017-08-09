<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
        
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="item" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'
export default {
  name: 'slider',
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted () {
    // 为了保证DOM的整成渲染, 一般在17毫秒左右成功
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      // 启动自动播放
      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    // 解决窗口大小改变, 但是轮播图大小不改变问题
    // 监听窗口改变事件
    window.addEventListener('resize', () => {
      // 证明还没有进行初始化
      if (!this.slider) {
        return
      }
      // 重新计算宽度
      this._setSliderWidth(true)
      // 刷新slider, slider中的元素重新生成
      // 就避免了改变时的宽度错乱. 
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth(isResize) {
      // 可以直接访问子组件, 这就获取到了, 所有放着a标签, a标签中放着img标签的 父div
      // 这个是由父组件分发而来的, 我们现在是为了设置整个slider的宽度, 必须采用动态获取的方式
      // 也就需要去访问其中的子组件, 并知道每个子组件的宽度
      // slider : 指的是整个一个轮播图的宽度.
      // slider = slider-group + dots
      // 由轮播图的内容, 和下面的小数点构成的
      this.children = this.$refs.sliderGroup.children
      // 定义父元素的宽度, 然后可以刚刚好放下哪些个变化的盒子
      let width = 0

      // 这个宽度指的是slider的宽度, 是随着屏幕的变化而变化的
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        // 获取到每一包含内容的div
        let child = this.children[i]
        // console.log(child)
        // 给每一个每一个child设置一个父元素传进来的包含内容的div, 一个类名'slider-item'
        addClass(child, 'slider-item')
        // 给每一个child一个宽度
        child.style.width = sliderWidth + 'px'
        // 外层的一个宽度应该是有所的子盒子相加起来
        width += sliderWidth
      }

      // 给左右克隆两个DOM , 所有宽度 是应该再加两个
      // 因为初始化一次后, 中间盒子的个数已经变成了起个, 所以没有必要再 + 2 . 反而会造成每次的叠加
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      // 最后给了用来盛放的盒子, 其实就是我们之前盛放li 的 ul
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider() {
      // 初始化轮播图
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400
      })
      // 监听滚动结束了, 然后获取滚动到第几张了, 之后为doti添加应有的样式
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        if (this.loop) {
          // 因为, 我们前面有一张重复的.
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex
        // 重复轮播
        if (this.autoPlay) {
          // 首先清除定时器, 不然会形成定时器的一个嵌套
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    // 初始化下面的Dot
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    // 播放, 自动播放
    _play() {
      // 获取当前的页面. 因为从0开始, 所以 +1
      let pageIndex = this.currentPageIndex + 1
      if (this.loop) {
        // 因为最开始有一个副本, 所以需要再加1
        pageIndex += 1
      }
      this.timer = setTimeout(() => {
        // 滚动到对应的页面, 参数(X的索引, Y的索引, 动画执行, 惠东函数)
        // 我理解的第三个参数, 是完成需要的时间
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable.stylus"
.slider
  min-height 1px
  .slider-group
    position relative
    overflow hidden
    white-space nowrap
    .slider-item
      float left
      box-sizing border-box
      overflow hidden
      text-align center
      a
        display block
        width 100%
        overflow hidden
        text-decoration none
        img
          display block
          width 100%
  .dots
    position absolute
    right 0
    left 0
    bottom 12px
    text-align center
    font-size 0
    .dot
      display inline-block
      margin 0 4px
      width 8px
      height 8px
      border-radius 50%
      background $color-text-l
      &.active
        width 20px
        border-radius 5px
        background $color-text-ll
</style>

