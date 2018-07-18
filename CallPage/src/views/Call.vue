<template lang="html">
  <window>
    <name-input></name-input>
  </window>
</template>

<script>
import Window from '@/components/Window.vue'
import NameInput from '@/components/NameInput.vue'

export default {
  components: {
    Window, NameInput
  },
  mounted() {
  }
}
</script>

<style lang="stylus">
:focus {
  outline: 0
}
</style>
