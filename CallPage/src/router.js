import Vue from 'vue'
import Router from 'vue-router'
import Call from './views/Call.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:seed',
      name: 'call',
      component: Call
    },
    {
      path: '/:seed/:myTag',
      name: 'call-tag',
      component: Call
    }
  ]
})
