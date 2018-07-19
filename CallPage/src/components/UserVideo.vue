<template lang="html">
  <transition name="zoom" @after-enter="onUpdate()">
    <div class="user-video">
      <div class="tooltip vue-tooltip-theme" role="tooltip" aria-hidden="false" x-placement="top" style="position: absolute; will-change: transform; top: -50px; left: 50%; margin-left:-60px; width: 120px;"><div class="tooltip-arrow" style="left: 50px;"></div><div class="tooltip-inner" style="text-align:center">{{ name }}</div></div>
      <div class="inner">
        <div v-if="status !== 'connected'" class="vid-status">
          <atom-spinner :color="'#90abad'" :size='90'></atom-spinner>
        </div>
        <div v-show="status === 'connected'">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  AtomSpinner
} from 'epic-spinners'
export default {
  props: ['name', 'status', 'onUpdate'],
  components: {
    AtomSpinner
  }
}
</script>

<style lang="stylus" scoped>
.zoom-enter-active, .zoom-leave-active {
  transition width .5s
  width 250px
  overflow hidden
}

.zoom-enter {
  width 0
}

.user-video {
  height 100%
  position relative

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
