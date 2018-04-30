<template lang="html">
  <div class="window">
    <div class="inner">
      <h1>Share this link!</h1>
      <p>
        People will be able to call you with this link while you keep this tab open.
      </p>
      <b>Beta notice:</b> Only works with 1 to 1 conversations at the moment.
      <br /><br />
      <input type="text" readonly :value="url" @click="onUrlClick()" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['url'],
  methods: {
    onUrlClick(e) {
      var input = event.currentTarget
      input.select()
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
    display inline-block
    margin-top 200px
    width 50%
    max-width 400px

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
