<template>
  <scroll class="listview" :data="data">
    <!-- 歌手左列表 -->
    <!-- 整个外层的一个嵌套, 例如热门是一块, a是一块 -->
    <ul>
      <li v-for="group in data" :key="group.title" class="list-group" >
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
    <div class="list-shortcut">
      <ul>
        <li v-for="item in shortcutList" :key="item" class="item">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
// 现在我们的这个scroll组件是可以直接嵌套的, 嵌套后自己在其中直接形成一个滚动的空间
import Scroll from 'base/scroll/scroll'
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

