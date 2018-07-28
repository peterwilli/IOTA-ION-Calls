<template lang="html">
  <window v-if="typeof user === 'undefined'">
    <name-input :onFinish="onSetNickname"></name-input>
  </window>
  <div v-else>
    <toolbar>
      <div slot="buttons-left">
        <toolbar-button @click.native="overlay = 'changeNickname'">
          <div>Change Nickname</div>
        </toolbar-button>
      </div>
      <div slot="buttons-right">
      </div>
    </toolbar>
    <call ref="call" v-show="overlay === null"></call>
    <window v-if="overlay === 'changeNickname'">
      <name-input :onFinish="onChangeNickname"></name-input>
    </window>
  </div>
</template>

<script>
import Window from '@/components/Window.vue'
import Call from '@/components/Call.vue'
import NameInput from '@/components/NameInput.vue'
import Toolbar from '@/components/Toolbar/Toolbar.vue'
import ToolbarButton from '@/components/Toolbar/ToolbarButton.vue'
import store from 'store'

export default {
  components: {
    Window, NameInput, Call, Toolbar, ToolbarButton
  },
  methods: {
    loadUser() {
      this.user = store.get('user')
    },
    onSetNickname() {
      this.loadUser()
    },
    onChangeNickname() {
      this.loadUser()
      this.$refs.call.onChangeNickname()
      this.overlay = null
    }
  },
  mounted() {
    this.loadUser()
  },
  data() {
    return {
      user: null,
      overlay: null
    }
  }
}
</script>

<style lang="stylus">
:focus {
  outline: 0
}
</style>
