// 异步修改状态

// 一次修改, 多个mutation

import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/until'

// 选择了歌曲, 然后需要更改一系列的状态
export const selectPlay = function ({commit, state}, {list, index}) {
  // 更改顺序播放列表
  commit(types.SET_SEQUENCE_LIST, list)
  // 更改播放列表
  commit(types.SET_PLAYLIST, list)
  // 更改播放序号, 也就是当前播放的哪一个
  commit(types.SET_CURRENT_INDEX, index)
  // 更改全篇显示状态
  commit(types.SET_FULL_SCREEN, true)
  // 更改播放状态
  commit(types.SET_PLAYING_STATE, true)
}

// 开始随机播放某个歌单
export const palyRandomList = function ({commit}, {list}) {
  // 设置播放状态
  commit(types.SET_PLAY_MODE, playMode.random)
  // 设置一个顺便播放列表
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  // 更改播放列表
  commit(types.SET_PLAYLIST, randomList)
  // 从随机列表的第一个开始播放
  commit(types.SET_CURRENT_INDEX, 0)
  // 更改全篇显示状态
  commit(types.SET_FULL_SCREEN, true)
  // 更改播放状态
  commit(types.SET_PLAYING_STATE, true)
}
