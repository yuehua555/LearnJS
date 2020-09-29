<!--
 * @Author: George Wu
 * @Date: 2020-09-26 20:24:08
 * @LastEditors: George Wu
 * @LastEditTime: 2020-09-29 17:26:11
 * @FilePath: \vueCli\vuecliTest\src\App.vue
-->
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div>
      <router-link to="/">首页</router-link>
      <router-link to="/hi">hi页面</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
