<template>
  <div class="home">
    <intro></intro>
    <div class="btn" @click="newCall()">
      New conversation
    </div>
  </div>
</template>

<script>
import tryteGen from '@/utils/tryteGen.js'
import iota from '@/utils/iota.js'
import Intro from '@/components/Intro.vue'

const nanoid = require('nanoid')

export default {
  name: 'home',
  methods: {
    newCall() {
      var seed = nanoid(16)
      this.$router.push({
        name: 'call',
        params: {
          seed
        }
      })
    }
  },
  components: {
    Intro
  }
}
</script>
