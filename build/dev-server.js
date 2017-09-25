require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

var axios = require('axios')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()

// 手动代理这个请求, 完成跨域
var apiRoutes = express.Router()

// 获取歌手详情列表
apiRoutes.get('/getDiscList', function (req, res) {
  // console.log('接收到请求了')
  // 通过node发送请求, 修改refer与host
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    //  我的天呐, 写错了一个header, 一个refer
    headers: {
      referer: 'https://c.y.qq.com/'
    },
    params: req.query
  }).then((response) => {
    // 获取到响应, response, 再通过自己的响应发送给我们的前端页面
    // 响应时对数据进行格式化, 返回一个json串
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})


// 获取歌词
apiRoutes.get('/lyric', function (req, res) {
  // 定义地址
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  // 使用axios发送请求
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/portal/player.html'
    },
    params: req.query
  }).catch((err) => { // 捕获错误, 并打印错误
    console.log(err)
  }).then((response) => { // 没有错误, 返回给前端数据
    // 返回的时候, 鼠标格式化下数据
    // 先拿下数据, 然后判断下类型
    // 不明白为什么要判断是不是字符串类型, 感觉意义不大啊, 直接正则不就好了
    var ret = response.data
    if (typeof ret === 'string') {
      // 建立正则表达式
      var reg = /^\w+\(({[^()]+})\)$/ // 一脸懵逼啊
      var mathes = ret.match(reg)
      if (mathes) {
        ret = JSON.parse(mathes[1])
      }
    }
    res.json(ret)
  })
})


// 使用这个api
app.use('/api', apiRoutes)

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({
      action: 'reload'
    })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {
      target: options
    }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
