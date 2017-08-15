<template>
  <div class="recommend">
    <div class="recommend-content">
      <div v-if="recommends.length" class="slider-wrapper">
        <slider>
          <div :key="item.id" v-for="item in recommends">
            <a :href="item.linkUrl">
              <img :src="item.picUrl" alt="">
            </a>
          </div>
        </slider>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li :key="item.dissid" v-for="item in discList" class="item" >
            <div class="icon">
              <img width="60px" height="60px" :src="item.imgurl" alt="">
            </div>
            <div class="text">
              <h2 class="name" v-html="item.creator.name"></h2>
              <p class="desc" v-html="item.dissname"></p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Slider from 'base/slider/slider'
import {getRecommend, getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'

export default {
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  // 钩子函数, 组件创建完成
  created() {
    this._getRecommend()
  },
  methods: {
    _getRecommend () {
      var _this = this
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          _this.recommends = res.data.slider
        }
      })
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
          console.log(this.discList)
        }
      })
    }
  },
  components: {
    Slider
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable.stylus"
.recommend
  // position fixed
  width 100%
  top 88px
  // bottom 0
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
</style>