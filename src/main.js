// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'

// 去掉300毫秒的延时
import fastclick from 'fastclick'
fastclick.attach(document.body)

// 图片懒加载问题
Vue.use(VueLazyLoad, {
  loading: require('common/image/loading_eat.gif')
})
// Vue.config.productionTip = false
import 'common/stylus/index.stylus'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
