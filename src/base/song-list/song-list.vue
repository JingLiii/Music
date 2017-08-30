<template>
  <div class="song-list">
    <ul>
      <li v-for="song in songs" class="item":key="song.name">
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
      display flex
      align-items center
      box-sizing border-box
      height 64px
      font-size $font-size-medium
      .content
        flex 1
        line-height 20px
        overflow hidden
        .name
          no-wrap()
          color $color-text
        .desc
          no-wrap()
          color $color-text-d
</style>

