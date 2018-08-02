<template lang="html">
  <window>
    <h2>Share this link!</h2>
    <div class="inner">
      <p>
        People will be able to call you with this link while you keep this tab open.
      </p>
      <b>Beta notice:</b> Tested on Chrome on desktop and Android, with iOS only Safari has WebRTC, but we weren't able to get it to work with ION at the moment.
      <b>Please use the bug report function on the top-left if you experience any problems!</b>
      <br /><br />
      <text-input ref="urlField" v-model="url" @click.native="onUrlClick"></text-input>
    </div>
  </window>
</template>

<script>
import Window from '@/components/Window.vue'
import TextInput from '@/components/TextInput.vue'

export default {
  props: ['url'],
  components: {
    TextInput,
    Window
  },
  mounted() {
    this.$refs.urlField.$refs.inputField.readOnly = true
  },
  methods: {
    onUrlClick(e) {
      var input = this.$refs.urlField.$refs.inputField
      input.select()
    }
  }
}
</script>

<style lang="stylus" scoped>
* {
  color #fff!important
}
</style>
