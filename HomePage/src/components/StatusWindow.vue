<template lang="html">
  <div class="window" v-if="shouldShow()">
    <div class="inner">
      <div v-if="error !== null" class="error">
        <h3 align="center">Oopsie woopsie...</h3>
        <p align="center">
          We made a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!
          <button class="btn-hover color-5" @click="reload()">
            Try again
          </button>
        </p>
      </div>
      <div v-else>
        <h1 align="center">Connecting...</h1>
        <p align="center">
          <pulse-loader></pulse-loader>
          We've got a partner!
          <br />
          Please be patient...
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  props: ['status', 'error'],
  components: {
    PulseLoader
  },
  methods: {
    reload() {
      window.location.reload()
    },
    shouldShow() {
      return (this.status !== 'idle' && this.status !== 'connected') || this.error !== null
    }
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
