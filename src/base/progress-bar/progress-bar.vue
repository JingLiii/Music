<template>
  <div class="progress-bar" ref="progressBar" @click="onClickPrgressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress">
        <div 
          class="progress-btn-wrapper" 
          ref="progressBtn"
          @touchstart.prevent="progressTouchStart"
          @touchmove.prevent="progressTouchMove"
          @touchend.prevent="progressTouchEnd"
        >
          <div class="progress-btn"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom'
// 定义播放点击按钮宽度的常量
const progressBtnWidth = 16
// 整个外部的一个宽度
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
      // 首先保证, 已经播放, 其次保证, 这个过程没有被拖动
      if (newPrecent >= 0 && !this.touch.initiated) {
        // 定义一个外部的宽度, 也就是盛放的进度条的盒子的宽度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 定义我们现在进度的宽度
        const offsetWidth = newPrecent * barWidth
        // 应用样式
        this._offset(offsetWidth)
      }
    }
  },
  created () {
    // 保存一个touch对象, 以便保存数据
    this.touch = {}
  },
  methods: {
    // 手指在屏幕上的操作
    progressTouchStart(event) {
      // 保证已经按下
      this.touch.initiated = true
      // 记录按下的X轴的方向
      this.touch.startX = event.touches[0].pageX
      // 记录btn所滚动的一个宽度
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(event) {
      // 如果没有进行初始化, 没有进入start事件
      if (!this.touch.initiated) {
        return
      }
      // 计算纵向的一个偏移量
      const deltaX = event.touches[0].pageX - this.touch.startX
      // 计算我们的这些偏移量, 需要达到什么程度, 肯定是本来已经偏移的量, 再加上现在又需要偏移的
      // 必须大于0
      // 必须小于整个bar的宽度
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd(event) {
      this.touch.initiated = false
      // 拖动结束的时候, 派发事件, 以达到拖动到相应位置的结果
      this._precentChange()
    },
    // 点击整个进度条的时候
    onClickPrgressBar(event) {
      // 设置我们进度条的位置
      // 获取进度条在左边的一个距离
      const rect = this.$refs.progressBar.getBoundingClientRect()
      // 点击位置距离左边进度条的位置 = 点击位置的位置距离 - 进度条距离左边的距离
      const offsetWidth = event.pageX - rect.left
      this._offset(offsetWidth)
      // 当我们点击进度条按钮的时候, 获取有问题, 获取了按钮距离左边的一个距离
      // this._offset(event.offsetX)
      // 通知父元素, 我们的百分比更改了多少
      this._precentChange()
    },
    // 通知父组件, 里面改变了多少precent
    _precentChange() {
      // 这里的计算是根据, 当前我们的进度条走的位置所计算出来
      // 所以, 当我们想要改变的时候, 只需要更改进度条的位置, 并且告诉父组件, 进度条的改变即可
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const left = this.$refs.progress.clientWidth
      let newPrecent = left / barWidth
      this.$emit('precentChange', newPrecent)
    },
    // 定义根据传入的偏移的量, 修改页面DOM元素的位置
    _offset(offsetWidth) {
      this.$refs.progress.style['width'] = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
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
