import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Call from './views/Call.vue'

Vue.use(Router)

export default new Router({
  hashbang: false,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    // catch-all
    { path: '*', redirect: '/' }
  ]
})
