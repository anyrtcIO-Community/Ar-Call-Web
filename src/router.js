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
      path: '/call/:userId',
      name: 'call',
      component: () => import('./views/call.vue')
    },
  ]
})
