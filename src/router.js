import Vue from 'vue'
import Router from 'vue-router'
import Content from '@/views/Content.vue'
import Schema from '@/views/Schema.vue'
import Settings from '@/views/Settings.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      name: 'Dashboard',
      path: '/',
    },
    {
      name: 'Register',
      path: '/register',
    },
    {
      name: 'Schema',
      path: '/:projectId/schema/:path?',
      component: Schema,
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
  ],
})
