<template lang="html">
  <div>
    <p style="font-weight: bold">
      Bug Report
    </p>
    <p v-if="reviewLogs === null">
      ION is still in beta and you can experience problems.
      The best way to help fixing it is by giving the developers insights into the trouble you were having.
      ION will never send any data about you over the internet, so if you want to help out, you can opt-in to send diagnostic data!

      <ul>
        <li>
          All data is secured and can only be read by the developers
        </li>
        <li>
          All data is stored in the IOTA Tangle
        </li>
        <li>
          Sensitive or personal information (i.e IP adresses) are redacted
        </li>
      </ul>
      <a href="#" @click="viewLogs">Click here to view the logs</a>
    </p>
    <div v-else class="logReview">
      <textarea>{{ reviewLogs }}</textarea>
      <a href="#" @click="goBack">Go back</a>
    </div>
    <button class="btn-hover color-3" @click="ok()">
      Send logs
    </button>
  </div>
</template>

<script>
import store from 'store'

export default {
  props: ['onFinish', 'honestDebugger'],
  methods: {
    ok() {

    },
    viewLogs(e) {
      e.preventDefault()
      this.reviewLogs = this.honestDebugger.getRawFilteredLogs()
    },
    goBack(e) {
      e.preventDefault()
      this.reviewLogs = null
    }
  },
  data() {
    return {
      reviewLogs: null
    }
  }
}
</script>

<style lang="stylus" scoped>
p {
  color #fff
}

.logReview {
  textarea {
    width 100%
    height 500px
  }
}
</style>
