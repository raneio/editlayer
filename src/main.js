import '@/sass/index.sass'
import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { sync } from 'vuex-router-sync'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/sass/sass.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
// import 'codemirror/theme/base16-dark.css'
// import 'codemirror/theme/railscasts.css'

// import VueSimplemde from 'vue-simplemde'
// Vue.use(VueSimplemde)

sync(store, router)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
