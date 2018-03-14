import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
// import AdminMode from '@/views/AdminMode.vue'
// import Editlayer from '@/views/Editlayer.vue'
import Content from '@/views/Content.vue'
import Structure from '@/views/Structure.vue'
import Settings from '@/views/Settings.vue'

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
      name: 'Content',
      path: '/edit/content/:projectId?/:path?',
      component: Content,
    },
    {
      name: 'Structure',
      path: '/edit/structure/:projectId?/:path?',
      component: Structure,
    },
    {
      name: 'Settings',
      path: '/edit/settings/:projectId?/:path?',
      component: Settings,
    },
    {
      path: '/admin',
      redirect: { name: 'Content' }
    },
    {
      path: '/edit',
      redirect: { name: 'Content' }
    },
  ]
})
