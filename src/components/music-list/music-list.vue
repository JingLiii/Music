<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title"></h1>
    <div class="bg-image">
      <div class="filter"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 背景图
    bgImage: {
      type: String,
      default: ''
    },
    // 歌曲列表
    songs: {
      type: Array,
      default: []
    },
    // 标题
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable.stylus"
@import "~common/stylus/mixin.stylus"

</style>
