<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" class="singer-detail"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
  data () {
    return {
      // 所有的歌曲的一个列表
      songs: []
    }
  },
  computed: {
    // 通过计算属性来取值.
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
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
      // 因为我们的vuex是在我们点击的时候, 才会去setSinger这个数据, 我们才能拿到这个数据
      // 如果我们直接刷新这个数据的话, 是取不到的

      if (!this.singer.id) {
        this.$router.push('/singer')
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    // 格式化歌曲
    _normalizeSongs(list) {
      let arr = []
      // 遍历这个数组, 其实这个数组, 是我们的res.data.list
      // 其中的每一项都一个歌曲的数据, 在这个数据中, 只有musicData是重要的
      list.forEach(function(item) {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          // 将每一项数据传入, 然后生成一个新的song对象, 每个对象放入到数组中
          arr.push(createSong(musicData))
        }
      }, this)
      return arr
    }
  },
  components: {
    MusicList
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

