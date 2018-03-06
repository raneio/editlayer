import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
// import AdminMode from '@/views/AdminMode.vue'
import Editlayer from '@/views/Editlayer.vue'

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
      name: 'edit',
      path: '/edit/:id?/:path?',
      component: Editlayer,
    },
    {
      name: 'schema',
      path: '/schema/:id?/:path?',
      component: Editlayer,
    },
    {
      name: 'settings',
      path: '/settings/:id?/:path?',
      component: Editlayer,
    },
    {
      path: '/admin',
      redirect: { name: 'edit' }
    },
  ]
})
