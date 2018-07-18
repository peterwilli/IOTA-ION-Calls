<template lang="html">
  <div class="user-video" v-tooltip="{
    content: name,
    show: true
  }">
    <div class="inner">
      <div v-if="status !== 'connected'" class="vid-status">
        <atom-spinner :color="'#90abad'" :size='90'></atom-spinner>
      </div>
      <div v-show="status === 'connected'">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { AtomSpinner } from 'epic-spinners'
export default {
  props: ['name', 'status'],
  components: {
    AtomSpinner
  }
}
</script>

<style lang="stylus" scoped>
.user-video {
  transition all 0.5s
  height 100%
  width 250px
  margin-left 50px

  .inner {
    border-radius 25px
    box-shadow 0 0px 55px 0 rgba(0, 0, 0, 0.75)
    overflow hidden
  }
}

.vid-status {
  width 250px
  height 250px
  background: #d9e9ea
  display flex
  align-items center
  justify-content center
}
</style>
