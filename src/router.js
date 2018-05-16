import Vue from 'vue'
import Router from 'vue-router'
import Content from '@/views/Content.vue'
import Structure from '@/views/Structure.vue'
import Settings from '@/views/Settings.vue'
import Dashboard from '@/views/Dashboard.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      name: 'Dashboard',
      path: '/',
      component: Dashboard,
    },
    {
      name: 'Register',
      path: '/register',
    },
    {
      name: 'Structure',
      path: '/:projectId/structure/:path?',
      component: Structure,
    },
    {
      name: 'Settings',
      path: '/:projectId/settings/:path?',
      component: Settings,
    },
    {
      name: 'Content',
      path: '/:projectId/:path?',
      component: Content,
    },
    // {
    //   path: '*',
    //   redirect: { name: 'Dashboard' }
    // },
    // {
    //   path: '/:projectId',
    //   redirect: to => {
    //     console.log('to', to)
    //   },
    // },
    // {
    //   path: '/admin',
    //   redirect: { name: 'Content' }
    // },
    // {
    //   path: '/edit',
    //   redirect: { name: 'Content' }
    // },
  ],
})
