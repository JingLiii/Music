import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  // 对象深拷贝, 但是只能拷贝一层.
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    _: 1502702589729
  })
  return jsonp(url, data, options)
}

export function getDiscList() {
  const url = '/api/getDiscList'
  // const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

  // 对象深拷贝, 但是只能拷贝一层.
  const data = Object.assign({}, commonParams, {
    rnd: Math.random(),
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  })
  // 像本地发送请求
  return axios.get(url, {
    params: data
  }).then((res) => {
    // 成功后， 返回一个promise对象，并在其中包含成功的属性
    return Promise.resolve(res.data)
  })
}
