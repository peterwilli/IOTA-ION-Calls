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
    border-radius 15px
    border 2px solid rgba(104, 220, 255, 0.56)
    background rgba(255,255,255, 0.3)
    box-shadow 0px 0px 100px 0px rgba(0, 0, 0, 0.8)
    color #fff
  }
}
</style>
