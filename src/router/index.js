import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/login'
import test from '@/views/test'
import index from '@/views/index'
import cloud from '@/views/cloud/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/cloud',
      name: 'cloud',
      component: cloud
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/',
      name: 'index',
      component: index
    }
  ]
})
