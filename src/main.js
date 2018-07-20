import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

// Open Sans font
import 'typeface-open-sans'

// Font awesome icons
import '@/utils/icons'

// Corelayer components and style
import '@/core/components/initialize'
import '@/core/sass/initialize.sass'

// Vue Transitions
import '@/sass/transitions.sass'

// Sync router and store
sync(store, router)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
