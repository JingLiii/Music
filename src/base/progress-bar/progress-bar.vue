<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress">
        <div class="progress-btn-wrapper">
          <div class="progress-btn" ref="progressBtn"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom'
// 定义播放点击按钮宽度的常量
const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  props: {
    // 接受一个百分比, 用来控制显示
    precent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    // 监听歌曲不断的变化
    precent(newPrecent) {
      if (newPrecent >= 0) { // 感觉这是一个保证条件
        // 定义一个外部的宽度, 也就是盛放的进度条的盒子的宽度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 定义我们现在进度的宽度
        const offsetWidth = newPrecent * barWidth
        // 应用样式
        this.$refs.progress.style['width'] = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.stylus"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
