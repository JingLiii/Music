// 在这个里面定义修改的操作
import * as types from './mutation-types'

// 这里面就是一个方法, 里面就是一些相关的修改方法
const matutaions = {
  // [方法名](参数)
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  }
}

export default matutaions
