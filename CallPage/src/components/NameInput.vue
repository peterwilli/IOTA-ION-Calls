<template lang="html">
  <div>
    <p style="font-weight: bold">
      Hello there! Please set a nickname for other people to see.
    </p>
    <p>
      Note: This is only stored locally, it won't be stored online anywhere. Only people you will call or people who will call you will be able to see this.
    </p>
    <text-input v-model="name" placeholder="Enter name here..."></text-input>
    <br />
    <button class="btn-hover color-3" @click="ok()">
      Let's go!
    </button>
  </div>
</template>

<script>
import TextInput from '@/components/TextInput.vue'
import store from 'store'

export default {
  props: ['onFinish'],
  methods: {
    ok() {
      store.set('user', { name: this.name })
      this.onFinish()
    }
  },
  components: {
    TextInput
  },
  data() {
    return {
      name: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
p {
  color #fff
}
</style>
