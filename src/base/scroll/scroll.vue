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
      },
      // 是否监听滚动事件
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
    // 组件实例化的时候
    mounted () {
      // 确保DOM元素渲染
      setTimeout(() => {
        this._initScroll()
        // 是否监听scroll
        if (this.listenScroll) {
          const _this = this
          // 然后让这个sroll实例, 监听滚动事件
          this.scroll.on('scroll', (pos) => {
            // 获取到滚动的位置
            // 然后给父组件派发一个事件出去, 并且把pos参数传出去
            // 这里的this指向了scroll实例, 不再是这个组件, 所以需要缓存this
            _this.$emit('scroll', pos)
          })
        }
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
      },
      scrollTo() { // 滚动到指定的位置
        // 调用scroll的原因是, 这个方法不一定在哪里调用, this的指向容易不明确
        // 但是始终不明白传入arguments的原因
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() { // 滚动到指定元素
        // arguments是个数组, 把参数传进去.
        // arguments是调用这个方法时的参数
        // 这样的话, 就不需要再去添加形参进行传递了
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
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
