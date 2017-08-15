<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    // 接受的参数: 表示需要传入的数据
    props: {
      // 在官方文档上描述的是: 是否节流
      probeType: {
        type: Number,
        default: 1
      },
      // 是否通过点击派发事件
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      }
    },
    // 组件实例化的时候
    mounted () {
      // 确保DOM元素渲染
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      // 开始初始化这个滚动组件
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
      },
      // 代理一些方法
      enable() { // 开启better-scroll
        this.scroll && this.scroll.enable()
      },
      disable() { // 禁用better-scroll
        this.scroll && this.scroll.disable()
      },
      refresh() { // 强制重新刷新better-scroll
        this.scroll && this.scroll.refresh()
      }
    },
    // 监控数据变化
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }

</script>
