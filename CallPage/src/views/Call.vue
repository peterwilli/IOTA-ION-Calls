<template lang="html">
  <window v-if="typeof user === 'undefined'">
    <name-input :onFinish="onSetNickname"></name-input>
  </window>
  <call v-else></call>
</template>

<script>
import Window from '@/components/Window.vue'
import Call from '@/components/Call.vue'
import NameInput from '@/components/NameInput.vue'
import store from 'store'

export default {
  components: {
    Window, NameInput, Call
  },
  methods: {
    loadUser() {
      this.user = store.get('user')
    },
    onSetNickname() {
      this.loadUser()
    }
  },
  mounted() {
    this.loadUser()
  },
  data() {
    return {
      user: null
    }
  }
}
</script>

<style lang="stylus">
:focus {
  outline: 0
}
</style>
