<template lang="html">
  <div class="window">
    <div class="inner">
      <h1 align="center">Connecting...</h1>
      <p align="center">
        <pulse-loader></pulse-loader>
        We've got a partner!
        <br />
        Please be patient...
      </p>
    </div>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  components: {
    PulseLoader
  }
}
</script>

<style lang="stylus" scoped>
.window {
  position fixed
  left 0
  right 0
  top 0
  bottom 0

  .inner {
    background #fff
    padding 15px
    margin 0 auto
    margin-top 200px
    width 50%
    max-width 400px
    min-width 200px

    input {
      width 100%
      outline none
      padding 15px
      border 1px solid #d0d0d0

      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      -o-box-sizing: border-box;
      -ms-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
}
</style>
