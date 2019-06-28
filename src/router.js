import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Join.vue')
    },
    {
      path: '/p2p/:userId',
      name: 'p2p',
      component: () => import('./views/p2p.vue')
    },
  ]
})
