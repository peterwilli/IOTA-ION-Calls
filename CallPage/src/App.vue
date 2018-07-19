<template>
  <div id="app">
   <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
  require("@/style/buttons.styl")
  require("@/style/tooltip.styl")
  require("@/style/noty.css")
  require("@/style/animate.css")
</script>

<style lang="stylus">
body {
  background linear-gradient(315deg, #fc00aa, #00dbde)
  font-family verdana
  margin 0
  padding 0
  background-attachment fixed
}

body, html {
  height: 100%
}
</style>
