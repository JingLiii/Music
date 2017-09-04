<template>
  <div class="song-list">
    <ul>
      <!-- 不仅要找到点击的这首歌, 还是找到点击的第几首歌, 这样的话, 下一次播放的时候, 才能从这里开始 -->
      <li @click="selectItem(song, index)" v-for="(song, index) in songs" class="item":key="song.name">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  methods: {
    // 点击选择了歌曲列表的某一项
    selectItem(item, index) {
      this.$emit('select', item, index)
    },
    // 函数和filter是一样的, 都是一样的, 读取返回这
    getDesc(song) {
      return `${song.singer} 。${song.album}`
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.stylus"
  @import "~common/stylus/mixin.stylus"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>

