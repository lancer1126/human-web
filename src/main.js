import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router/routers'

import Cookies from 'js-cookie'
import Element from 'element-ui'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'normalize.css/normalize.css'

Vue.use(mavonEditor)
Vue.use(Element, {
  size: Cookies.get('size') || 'small'
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
