<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <!-- 因为需要绑定列表和wrapper同时滚动 然后在父级元素做滚动 -->
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div :key="item.id" v-for="item in recommends">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImg" :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li :key="item.dissid" v-for="item in discList" class="item" >
              <div class="icon">
                <img width="60px" height="60px" v-lazy="item.imgurl" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 未渲染的时候, 做个处理 -->
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Slider from 'base/slider/slider'
import Loading from 'base/loading/loading'
import {getRecommend, getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'

export default {
  data () {
    return {
      recommends: [],
      discList: [],
      checkLoaded: false
    }
  },
  // 钩子函数, 组件创建完成
  created() {
    const _this = this
    // 组件创建完成后, 开始获取数据并渲染模板
    setTimeout(function() {
      _this._getRecommend()
      _this._getDiscList()
    }, 1200)
  },
  methods: {
    // 获取推荐数据
    _getRecommend () {
      var _this = this
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          _this.recommends = res.data.slider
        }
      })
    },
    // 获取歌单列表数据
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    // 当一张图片加载完成后, 再一次渲染滚动部分, 以保证正确的高度
    loadImg() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        // 实例化时, 一定保证scroll, 在dom更新的时候, 重新计算高度
        this.checkLoaded = true
      }
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable.stylus"
.recommend
  // 只有固定定位后, 才能不影响本来父元素的高度, 达到自己的滚动效果
  position fixed
  width 100%
  top 88px
  bottom 0
  .recommend-content
    height 100%
    overflow hidden
    .slider-wrapper
      position relative
      width 100%
      overflow hidden
    .recommend-list
      .list-title
        height 65px
        line-height 65px
        text-align center
        font-size $font-size-medium
        color $color-theme
      .item
        display flex
        // box-sizing border-box
        align-items center
        padding 0 20px 20px 20px
        // background-color #add
        .icon
          // background-color #eee
          flex 0 0 60px
          font-size 0
          width 60px
          padding-right 20px
        .text
          display flex
          flex-direction column
          justify-content center
          flex 1
          line-height 20px
          overflow hidden
          font-size $font-size-medium
          .name
            margin-bottom 10px
            color $color-text
          .desc
            color $color-text-d
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>