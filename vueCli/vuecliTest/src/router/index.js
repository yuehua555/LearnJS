/*
 * @Author: George Wu
 * @Date: 2020-09-26 20:24:08
 * @LastEditors: George Wu
 * @LastEditTime: 2020-09-29 17:22:08
 * @FilePath: \vueCli\vuecliTest\src\router\index.js
 */
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Hi from '@/components/Hi'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },{
      path: '/Hi',
      name: 'Hi',
      component: Hi
    }
  ]
})
