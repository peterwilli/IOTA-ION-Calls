<template lang="html">
  <div class="toolbar noselect">
    <div class="bg"></div>
    <div class="buttons">
      <div class="left">
        <slot name="buttons-left"></slot>
      </div>
      <div class="right">
        <slot name="buttons-right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped>
.toolbar {
  position fixed
  top 0
  left 0
  right 0
  height 50px
  z-index 15
  color #fff

  .buttons {
    padding 5px
    .button:last-child {
      margin-right: 0
    }
    .button:first-child {
      margin-left: 0
    }
  }

  .bg {
    opacity 0
    transition opacity 1s
    background linear-gradient(to bottom, rgba(0,0,0,0.4) 0%,rgba(0,0,0,0) 100%)
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    z-index -1

    &:hover {
      opacity 1
    }
  }
}
</style>
