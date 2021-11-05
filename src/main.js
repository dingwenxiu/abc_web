import Vue from 'vue'
import App from './App.vue'
import router from './route'
import index from './store'
import { API } from './api'
import Utils from './lib/utils/utils'
import animation from './lib/animation/animation'
import _ from 'lodash'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'

import '@/assets/css/game.scss' // global css


//复制粘贴插件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

// Vue-Lazyload
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)

Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.prototype.Api = API
Vue.prototype.Utils = Utils
Vue.prototype.Animation = animation
Vue.prototype._ = _

new Vue({
  router,
  store: index,
  render: h => h(App)
}).$mount('#app')
