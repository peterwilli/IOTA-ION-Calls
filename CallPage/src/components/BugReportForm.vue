<template lang="html">
  <div>
    <div v-if="status === 'success'">
      <p style="font-weight: bold">
        Thanks! We'll see what we can do!
      </p>
      <button class="btn-hover color-3" @click="goBack">
        Go Back
      </button>
    </div>
    <div v-if="status === 'loading'">
      <p style="font-weight: bold">
        Sending now...
      </p>
      <p align="center">
        <atom-spinner :color="'#ffffff'" :size="100"></atom-spinner>
      </p>
      <button class="btn-hover color-3" @click="goBack()">
        Go Back
      </button>
    </div>
    <div v-if="status === null">
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
        <br />
        <button class="btn-hover color-3" @click="sendReport()">
          Send logs
        </button>
        <br />
        <a href="#" @click="viewLogs">Click here to view the logs</a>
        <br />
        <a href="#" @click="goBack">Go back</a>
      </p>
      <div v-else class="logReview">
        <textarea>{{ reviewLogs }}</textarea>
        <a href="#" @click="goBack">Go back</a>
      </div>
    </div>
  </div>
</template>

<script>
import store from 'store'
import {
  AtomSpinner
} from 'epic-spinners'

export default {
  props: ['onFinish', 'honestDebugger', 'iota'],
  components: {
    AtomSpinner
  },
  methods: {
    async sendTransfer(transfers) {
      const { iota } = this
      return new Promise(function(resolve, reject) {
        iota.api.sendTransfer('9'.repeat(81), 4, 9, transfers, (e, r) => {
          if (e) {
            reject(e);
          } else {
            resolve(r);
          }
        });
      });
    },
    async sendReport() {
      const { iota } = this
      this.status = 'loading'
      // Encrypt the whole thing using ECDH and filter out any sensitive data
      var securedLogs = this.honestDebugger.getSecuredLogs()

      // Convert to trytes
      var encryptedTrytes = iota.utils.toTrytes(JSON.stringify(securedLogs))
      var transfers = [{
        address: 'IONBUGREPORTSIONBUGREPORTSIONBUGREPORTSIONBUGREPORTSIONBUGREPORTSPETERSENDSHISLUVHNMQP9FRW',
        value: 0,
        message: encryptedTrytes
      }]
      try {
        var res = await this.sendTransfer(transfers)
        console.log('tx sent', res);
      } catch (e) {
        console.error('Log report error', e);
      } finally {
        this.status = 'success'
      }
    },
    viewLogs(e) {
      e.preventDefault()
      this.reviewLogs = JSON.stringify(JSON.parse(this.honestDebugger.getRawFilteredLogs()), null, 2)
    },
    goBack(e) {
      e.preventDefault()
      if(this.reviewLogs === null) {
        this.onFinish()
      }
      else {
        this.reviewLogs = null
      }
    }
  },
  data() {
    return {
      reviewLogs: null,
      status: null
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
