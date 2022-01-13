<template>
  <h2>我是渲染出来的</h2>
  <h2>我是渲染出来的11</h2>
  <hello-world></hello-world>
</template>

<script>
  import HelloWorld from "./helloWorld.vue";
  export default {
    components:{
      HelloWorld
    },
    name: "app"
  }
</script>

<style scoped>
  h2 {
    color: red;
  }
</style>
