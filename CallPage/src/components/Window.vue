<template lang="html">
  <div class="container">
    <div class="contents">
      <slot>

      </slot>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" scoped>
.container {
  position absolute
  left 0
  right 0
  top 0
  bottom 0
  display flex
  align-items center
  justify-content center

  .contents {
    text-align center
    float left
    width 50%
    max-width 450px
    min-width 100px
    min-height 500px
  }
}
</style>
