// 获取获取歌词的方法
import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
// 定义歌曲类
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric() {
    getLyric(this.mid).then((res) => {
      if (res.retcode === ERR_OK) {
        this.lyric = res.lyric
        console.log(this.lyric)
      }
    })
  }
}

// 来一个构造函数, 就不需要一次次的使用new对象出来了
// 抽象一个工厂方法, 直接实例化Song
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.albummid,
    // 所有的歌手, 直接把数组中的时候, 拼接起来
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

function filterSinger(singer) {
  let ret = []
  // 如果没有歌手的话, 直接返回一个空字符串
  if (!singer) {
    return ''
  }
  singer.forEach(function(item) {
    ret.push(item.name)
  }, this)
  return ret.join('/')
}
