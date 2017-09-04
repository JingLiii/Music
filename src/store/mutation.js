// 修改state中的数据, 在这里进行

// 在这个里面定义修改的操作
import * as types from './mutation-types'

// 这里面就是一个方法, 里面就是一些相关的修改方法
// mytations, 本身就是一个函数
const matutaions = {
  // [方法名](参数)
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  }
}

export default matutaions
