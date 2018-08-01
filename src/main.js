import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

// Open Sans font
import 'typeface-open-sans'

// Font awesome icons
import '@/utils/icons'

// Core components and style
import '@/components/core/registerAll'
import '@/sass/core/initialize.sass'

// Vue Transitions
import '@/sass/transitions.sass'

// Sync router and store
sync(store, router)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
