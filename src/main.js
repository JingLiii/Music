// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
import App from './App'
// import router from './router'

// 去掉300毫秒的延时
import fastclick from 'fastclick'
fastclick.attach(document.body)

// Vue.config.productionTip = false
import 'common/stylus/index.stylus'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
