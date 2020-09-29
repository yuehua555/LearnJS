<!--
 * @Author: George Wu
 * @Date: 2020-09-29 17:18:11
 * @LastEditors: George Wu
 * @LastEditTime: 2020-09-29 17:21:14
 * @FilePath: \vueCli\vuecliTest\src\components\Hi.vue
-->
<template>
    <div>
        <h2>{{ msg }}</h2>
    </div>
</template>

<script>
export default {
  name: 'Hi',
  data () {
    return {
      msg: 'I am Hi page.'
    }
  }
}
</script>

