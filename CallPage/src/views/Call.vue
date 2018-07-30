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
        <toolbar-button @click.native="overlay = 'sendBugReport'">
          <div>Send Bug Report</div>
        </toolbar-button>
      </div>
      <div slot="buttons-right">
      </div>
    </toolbar>
    <call ref="call" v-show="overlay === null" :iota="iota" :honest-debugger="honestDebugger"></call>
    <window v-if="overlay === 'changeNickname'">
      <name-input :onFinish="onChangeNickname"></name-input>
    </window>
    <window v-if="overlay === 'sendBugReport'">
      <bug-report-form :iota="iota" :honest-debugger="honestDebugger" :onFinish="onSendBugReport"></bug-report-form>
    </window>
  </div>
</template>

<script>
import Window from '@/components/Window.vue'
import Call from '@/components/Call.vue'
import NameInput from '@/components/NameInput.vue'
import BugReportForm from '@/components/BugReportForm.vue'
import Toolbar from '@/components/Toolbar/Toolbar.vue'
import ToolbarButton from '@/components/Toolbar/ToolbarButton.vue'
import store from 'store'
import HonestDebugger from '@/utils/HonestDebugger.js'
import IOTA from 'iota.lib.js'

export default {
  components: {
    Window, NameInput, Call, Toolbar, ToolbarButton, BugReportForm
  },
  methods: {
    loadUser() {
      this.user = store.get('user')
      this.honestDebugger.filters.push(new RegExp(this.user.name, 'g'))
    },
    onSetNickname() {
      this.loadUser()
    },
    onChangeNickname() {
      this.loadUser()
      this.$refs.call.onChangeNickname()
      this.overlay = null
    },
    onSendBugReport() {
      this.overlay = null
    },
    loadDebugger() {
      this.honestDebugger = new HonestDebugger('1b967fe15dafc289770946a57e8659f4c89ec1f57b29c544edd2929f2cb39279')
      // Filter out any IP adresses
      this.honestDebugger.filters.push(/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g)
      this.honestDebugger.start()
      window.honestDebugger = this.honestDebugger
    }
  },
  beforeMount() {
    this.iota = new IOTA({
      provider: 'https://nodes.testnet.iota.org:443/'
    })

    this.loadDebugger()
  },
  mounted() {
    this.loadUser()
  },
  data() {
    return {
      iota: null,
      user: null,
      overlay: null,
      honestDebugger: null
    }
  }
}
</script>

<style lang="stylus">
:focus {
  outline: 0
}
</style>
