import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import AdminMode from './views/AdminMode.vue'
import EditMode from './views/EditMode.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      name: 'admin',
      path: '/admin/:id?/:tab?',
      component: AdminMode,
    },
    {
      name: 'edit',
      path: '/edit/:id?/:path?',
      component: EditMode,
    },
  ]
})
