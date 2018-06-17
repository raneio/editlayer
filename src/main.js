import Vue from 'vue'
// import _ from 'lodash'
import { sync } from 'vuex-router-sync'
import 'typeface-open-sans'

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/utils/codemirror'

// Font awesome icons
import '@/utils/icons'

// Styles
import '@/sass/index.sass'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'

import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

// Register editor components globally
// Source: https://vuejs.org/v2/guide/components-registration.html
// const requireComponent = require.context('@/editors', false, /[A-Z]\w+\.vue$/)
// let editors = []
//
// requireComponent.keys().forEach(fileName => {
//   const componentConfig = requireComponent(fileName)
//   const componentName = fileName.toLowerCase().replace(/^\.\/(.*)\.\w+$/, '$1')
//   Vue.component(`${componentName}-editor`, componentConfig.default || componentConfig)
//   editors.push(componentName)
// })
//
// store.commit('setEditors', editors)

// Keep router and store.router synced
sync(store, router)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
