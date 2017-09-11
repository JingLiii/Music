<template>
  <div class="progress-circle">
    <svg 
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle 
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <!-- stroke-dasharray: 描边 -->
      <!-- stroke-dashoffset="": 描边的偏移量 -->
      <circle 
        class="progress-bar" 
        r="50" 
        cx="50" 
        cy="50" 
        fill="transparent" 
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>
 
<script>
  export default {
    props: {
      // 传入半径
      radius: {
        type: Number,
        default: 100
      },
      // 传递现在已经播放的百分比
      precent: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        // 表示周长
        dashArray: Math.PI * 100
      }
    },
    computed: {
      // 我们这会转了多多啥角度, 通过计算属性得到
      dashOffset() {
        return (1 - this.precent) * this.dashArray
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.stylus"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>

