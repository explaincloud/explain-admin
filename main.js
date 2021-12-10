import App from './App'
import Vue from 'vue'
import Store from './store'
import Creq from './uni_modules/explain-creq/js_sdk/explain-creq.js'
import CreqInterceptorCallFunction from './common/creq.interceptor.callfunction.js'

Vue.config.productionTip = false

Vue.prototype.$store = Store
Vue.prototype.$creq = Creq
Vue.prototype.$creq.interceptor.callFunction = CreqInterceptorCallFunction

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
