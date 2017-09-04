// 我们会从getter中取state中数据, 取到组件中

// 歌手信息
export const singer = state => state.singer

// 与播放相关的状态
export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playlist = state => state.playlist
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex

// getter也可以进行计算属性
// 通过计算获得当前播放的哪一首歌
export const currentSong = (state) => {
  // 如果没有的话, 就返回一个空对象
  return state.playlist[state.currentIndex] || {}
}

