
// 获取我们的配置文件
import {commonParams} from './config'
// 获取axios
import axios from 'axios'

export function getLyric(mid) {
  // 发送到我们自己代理的地址
  const url = '/api/lyric'

  // 传递数据
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    g_tk: 5381,
    pcachetime: new Date().getTime(),
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    format: 'json'
  })

  // 获取结果
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
