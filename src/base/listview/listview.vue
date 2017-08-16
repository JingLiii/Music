<template>
  <scroll class="listview" :data="data" ref="listview">
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
    <div class="list-shortcut" @touchmove.stop.prevent="onShortcutTouchMove" @touchstart="onShortcutTouchStart">
      <ul>
        <!-- 添加索引, 以便检查滑动到了第几个 -->
        <li v-for="(item, index) in shortcutList" :key="item" :data-index="index" class="item">
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
  },
  methods: {
    onShortcutTouchStart(event) {
      // 拿到我们滑动到了第几个元素的索引值
      let anchorIndex = getData(event.target, 'index')

      // 获取我们按下的时候, 按下的位置
      let firstTouch = event.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      // 让 srcoll 滚动到相应的位置
      this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex])
    },
    onShortcutTouchMove(event) {
      // 拿到滑动的元素
      // 再次记录移动的值
      let firstTouch = event.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 计算出移动的偏移量, 也就知道 我们偏移了几个位置
      // | 0 : 表示向下取整, 相当于Math.floor
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      console.log(delta)
      // 再根据开始的一个位置加上这些个位置
      // this.touch.anchorIndex: 这个属性是一个字符串, 需要变为数字
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex])
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

