<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <!-- 因为其中有html的转义字符 -->
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" @click="random" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <!-- 实时监听scroll的位置 -->
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
      <!-- 套一层, 为了控制内部的样式 -->
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'

  import {prefixStyle} from 'common/js/dom'

  // 来调用起来anctions
  import {mapActions} from 'vuex'

  // 预留的一个常量, 具体顶部保留的一个距离
  const RESERVEL_HEIGHT = 40
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  export default {
    // 组件
    components: {
      Scroll,
      SongList,
      Loading
    },
    // 传进来的属性
    props: {
      // 背景图
      bgImage: {
        type: String,
        default: ''
      },
      // 歌曲列表
      songs: {
        type: Array,
        default: []
      },
      // 标题
      title: {
        type: String,
        default: ''
      }
    },
    // 计算属性
    computed: {
      bgStyle() {
        return `background-image: url(${this.bgImage})`
      }
    },
    // 数据
    data () {
      return {
        // 监听纵向滚动的值
        scrollY: 0
      }
    },
    // 方法
    methods: {
      scroll(pos) {
        // 实时监听并更改scrollY的值
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      },
      // 监听到了选择的哪一首歌
      selectItem(item, index) {
        // 更改actions中的状态.刷新全局
        this.selectPlay({
          // 把整个歌单传入
          list: this.songs,
          // 如果状态相互对应的话, 就直接写了
          // 还是不能理解, 对象的这种写法.
          // ES6的写法, 相当于: index: index
          index
        })
      },
      // 随机播放
      random() {
        this.palyRandomList({
          list: this.songs
        })
      },
      // 用来获取actions中暴露出的方法
      ...mapActions([
        'selectPlay',
        'palyRandomList'
      ])
    },
    watch: {
      // 然后根据scrollY的值, 设置一个bg-layer的一个偏移量
      scrollY(newY) {
        // 无论我们如何拖动bg-layer始终都在那, max可以计算出来具体的偏移量
        let translateY = Math.max(this.minTranslateY, newY)
        // 设置变量, 用来控制层级关系的遮挡问题
        let zIndex = 0
        // 定义scale, 实现图片的放大与缩小
        let scale = 1
        // 定义blur, 控制图片的模糊程度
        let blur = 0

        this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`

        // 定义图片放大缩小的比例
        const percent = Math.abs(newY / this.imageHeight)

        // 判断是否处于向下拉的状态
        if (newY > 0) {
          scale = 1 + percent
          zIndex = 10
        } else { // 此时应该是向上滑动
          blur = Math.max(20 * percent, 20)
        }

        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        // 滚动起来起来之后, 当我们滚动到特定位置的时候, 也就是滚动位置, 小于了我们能够滚动的最小位置的时候
        if (newY < this.minTranslateY) {
          // 把图片的层级提上来
          zIndex = 10
          // 距离顶部的距离为0
          this.$refs.bgImage.style.paddingTop = 0
          // 给图片设置一个高度, 就是我们固定在上面的高度
          this.$refs.bgImage.style.height = `${RESERVEL_HEIGHT}px`

          // 让那个定位的按钮消失
          this.$refs.playBtn.style.display = 'none'
        } else {
          // 现在的情况是在恢复之前的状态, 那就都还原回来
          this.$refs.bgImage.style.paddingTop = `70%`
          this.$refs.bgImage.style.height = `0`
          this.$refs.playBtn.style.display = 'block'
        }
        this.$refs.bgImage.style.zIndex = zIndex

        this.$refs.bgImage.style[transform] = `scale(${scale})`
      }
    },
    // 创建整个Dom的时候
    created () {
      // 控制scroll组件的属性
      // 1: 在滑动停止时, 派发scroll事件
      // 2: 在滑动过程中派发scroll事件
      // 3: 不仅在滑动过程中, 也在momentum滚动动画时派发.
      this.probeType = 3
      // 是否监听滚动事件
      this.listenScroll = true
    },
    // 实例化对象的时候
    mounted () {
      // 记录下图片的高度
      this.imageHeight = this.$refs.bgImage.clientHeight
      // 记录下最小滚动的值
      this.minTranslateY = -this.imageHeight + RESERVEL_HEIGHT
      // 计算距离上不的top值的大小
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.stylus"
  @import "~common/stylus/mixin.stylus"
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      // 去掉之后, 上滑就不会被遮盖
      // overflow hidden
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
