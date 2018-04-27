<template>
  <div class="home">
    <div class="btn" @click="newCall()">
      New conversation
    </div>
  </div>
</template>

<script>
import seedGen from '@/utils/seedGen.js'
import iota from '@/utils/iota.js'
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

  }
}
</script>
