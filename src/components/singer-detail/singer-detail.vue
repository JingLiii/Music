<template>
  <transition name="slide">
    <div class="singer-detail">
      歌手详情页面
    </div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
export default {
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getDetail()
  },
  methods: {
    // 传入歌手的id, 获取歌手详细数据
    _getDetail() {
      // 如果没有这个id的话, 就返回到上一层
      // 因为用户, 在这个页面刷新后, 并不能得到任何的数据, 我们没有办法id
      if (!this.singer.id) {
        this.$router.push('/singer')
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.list)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable.stylus"
.singer-detail
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 100
  background-color $color-background
  
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>

