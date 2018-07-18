<template>
  <div id="app">
   <router-view></router-view>
  </div>
</template>

<script>
  require("@/style/buttons.styl")
</script>

<style lang="stylus">
body {
  background linear-gradient(315deg, #fc00aa, #00dbde)
  font-family verdana
  margin 0
  padding 0
}

body, html {
  height: 100%
}
</style>
