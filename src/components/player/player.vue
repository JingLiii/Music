<template>
  <div class="player" v-show="playlist.length>0">
    <!-- 这是一个具体的播放器 -->
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="alterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" alt="">
        </div>
        <!-- 顶部是一些信息 -->
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 唱片滚动地方 -->
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img :src="currentSong.image" alt="" class="image">
              </div>
            </div>
          </div>
        </div>
        <!-- 顶部的操作区 -->
        <div class="bottom">
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i @click="togglePlaying" class="icon-play "></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 这是一个收起后的播放器 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" alt="">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control"></div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 使用audio来播放音乐 -->
    <audio :src="currentSong.url" ref="audio"></audio>
  </div>
</template>

<script>
  // 引入vuex的一些状态
  // mapGetters是一个数组, 其中包含了我们想要的数据, 在计算属性中得到
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'

  // 添加前缀
  import {prefixStyle} from 'common/js/dom'
  const transform = prefixStyle('transform')

  export default {
    methods: {
      // 将播放器缩小
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      // 这是Vue为我们提供的一个js方法, 可以实现动画效果
      enter(element, done) {
        // 有两个参数, 第一个是执行的dom元素
        // 第二个一个执行完成的函数 done执行完成后, 就执行到下一个函数afterEnter中
        // 获得, 需要偏移的量, 和我们需要变化的一个倍数
        const {x, y, scale} = this._getPosAndScale()

        // 创建动画
        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.5)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        }

        // 初始化动画, 注册动画
        animations.registerAnimation({
          // 动画的名称
          name: 'move',
          // 动画的具体实现
          animation,
          // 动画的一些参数
          presets: {
            // 执行的时间
            duration: 300,
            easing: 'linear'
          }
        })
        // 执行这个动画
        // done 是一个回调函数, 执行完了, 就会调用这个函数
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        // 执行完成之后, 就要取消注册的动画
        animations.unregisterAnimation('move')
        // 然后将这个DOM元素的动画置为空
        this.$refs.cdWrapper.style.animation = ''
      },
      // 关闭的时候
      leave(element, done) {
        // 直接通过JS的方法, 添加CSS样式
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        // 获取位置
        const {x, y, scale} = this._getPosAndScale()
        // 然后给我们的dom元素添加这个样式
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        // 动画完成的时候, 执行回调函数, 用来表示这个动画执行完了
        // 监听动画完成事件
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      alterLeave() {
        // 清掉我们设置的动画样式
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style.transform = ''
      },
      // 暂停或者播放歌曲
      togglePlaying() {
        // 在Vuex中有一个playing状态
        // 当我们点击的时候, 更改vuex中的状态
        this.setPlayingSate(!this.playing)
      },
      // 获取位置和需要偏移的量
      _getPosAndScale() {
        // 小圆的一个宽度
        const targetWidth = 40
        // 距离左边的一个距离
        const paddingLeft = 40
        // 距离底部的高度
        const paddingBottom = 30
        // 大圆容器距离顶部的距离
        const paddingTop = 80
        // 大圆的宽度: 根据屏幕的宽度计算得来
        const width = window.innerWidth * 0.8
        // 初始的缩放比例
        const scale = targetWidth / width

        // 我们本来是在大圆的中心点, 然后通过这个x, y的一个偏移位置, 移动到下面的这个小圆上
        // 再从这个小圆上移动过去
        // x逐渐往左偏移, 需要偏移一个负值
        const x = -(window.innerWidth / 2 - paddingLeft)
        // y的值是逐渐向下走的, 固然是一个正直
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom

        return {
          x,
          y,
          scale
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingSate: 'SET_PLAYING_STATE'
      })
    },
    computed: {
      // 在计算属性中, 从vuex中取出想要的数据
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing'
      ])
    },
    watch: {
      // 获取当前歌曲的变化, 变化就开始播放
      currentSong() {
        // dom还没有准备好, 是没有办法播放的
        // $nextTick在修改数据之后立即使用它, 然后等待DOM更新, 把回调函数延迟到下次DOM更新循环之后.
        this.$nextTick(() => {
          this.$refs.audio.play()
        })
      },
      // 我们开始不断观察playging的变化
      playing(newPlayging) {
        const audio = this.$refs.audio
        // 检测变化
        this.$nextTick(() => {
          // 根据新值的变化, 来决定是播放, 还是暂停
          newPlayging ? audio.play() : audio.pause()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.stylus"
  @import "~common/stylus/mixin.stylus"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
