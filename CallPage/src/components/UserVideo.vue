<template lang="html">
  <div class="user-video" v-tooltip="{
    content: name,
    show: true
  }">
    <div class="inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['name']
}
</script>

<style lang="stylus" scoped>
.user-video {
  transition all 0.5s
  height 100%
  display inline-block

  .inner {
    border-radius 25px
    box-shadow 0 0px 55px 0 rgba(0, 0, 0, 0.75)
    overflow hidden
  }
}
</style>
