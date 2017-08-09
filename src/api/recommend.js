import jsonp from 'common/js/jsonp'
import {commonParmas, options} from './config'
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  // 对象深拷贝, 但是只能拷贝一层.
  const data = Object.assign({}, commonParmas, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}