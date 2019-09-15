import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import axios from 'axios'
import VueAxios from 'vue-axios'


Vue.use(VueAxios, axios);
Vue.axios.defaults.baseURL = 'http://91.134.24.233:4040';
Vue.config.productionTip = false
Vue.use(Antd)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
