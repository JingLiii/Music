// 引入配置文件
import {playMode} from 'common/js/config'

// 需要管理的数据状态
const state = {
  // 需要展示的歌手信息
  singer: {},
  // 播放器的播放状态
  palying: false,
  // 播放器的展开和收起
  fullScreen: false,
  // 播放的列表
  playlist: [],
  // 顺序列表
  sequenceList: [],
  // 播放模式
  // 默认是顺序播放
  mode: playMode.sequence,
  // 当前播放的哪首歌
  // 具体哪首歌, 就根据索引和播放列表计算而来
  currentIndex: -1
}

export default state