// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './layui/css/layui.css'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// var axios = require('axios')
// axios.defaults.baseURL = 'http://localhost:8080'
// axios.defaults.headers = {
//   "XWEB_TOKEN": window.sessionStorage.getItem("XWEB_TOKEN"),
//   "Content-type":"application/json;charset=UTF-8"
// }
// Vue.prototype.$axios = axios

Vue.config.productionTip = false
Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.user.username) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
}
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})