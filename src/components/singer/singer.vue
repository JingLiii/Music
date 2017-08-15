<template>
  <div class="singer">
    
  </div>
</template>

<script>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'

const HOT_NAME = '热门'
const HOT_SINGER_LINGTH = 10

export default {
  data () {
    return {
      singers: []
    }
  },
  // created, 就是表示这个组件已经创建完毕了, 但是还没有进行实例化
  // 实例化之前需要获取数据
  created () {
    this._getSingerList()
  },
  methods: {
    // 获取歌手数据
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = res.data.list
          console.log(this._normalizeSinger(this.singers))
        }
      })
    },
    // 格式化歌手数据
    _normalizeSinger(list) {
      // 定义map用来保存我们得到数据的一个中间变量
      let map = {
        // 热门歌手
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      // 遍历数据, 取出我们想要的数据
      list.forEach((item, index) => {
        // 首先是添加热门歌手
        // 查看是否在这个数组的前面, 如果小于热门歌手的长度, 就添加到热门歌手数组
        if (index < HOT_SINGER_LINGTH) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_id,
            name: item.Fsinger_name
          }))
        }

        // 再然后将歌手分类处理
        // 拿到歌手的首字母
        const key = item.Findex

        // 然后看下map中有没有这个key
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        // 再然后把这个歌手放进去
        map[key].items.push(new Singer({
          id: item.Fsinger_id,
          name: item.Fsinger_name
        }))
      })

      // 此时得到了我们想要的数据对象 map
      // 但我们依旧需要对map进行排序格式化
      let hot = []
      let ret = []
      for (let key in map) {
        // 获取到这个对象即可, key所对应的对象
        let val = map[key]
        // match(): 可以在字符串内检索指定的值
        // 检索这个map的这个key中, 有没有字母, 毕竟我们的热门关键字没有字母
        if (val.title.match(/[a-zA-Z]/)) { // 检索到了, 就放到ret中
          ret.push(val)
        } else if (val.title === HOT_NAME) { // 检测是不是热门那一组
          hot.push(val)
        }
      }

      // 再对let进行排序
      // 传进来的两个参数, 表示了其中的两两对比
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })

      // 拼接两个数组, 就是我们需要的结果
      return hot.concat(ret)
    }
  }
}
</script>

<style lang="stylus" scoped>
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>