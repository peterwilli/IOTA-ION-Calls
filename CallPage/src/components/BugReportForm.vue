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
      <img src="@/assets/bug_icon.png" width="120" />
      <p v-if="reviewLogs === null">
        We at ION Labs are 24/7 dedicated to give you the best decentralized experience possible. Please send your report so we can challenge the bug in our lab.
        Don’t worry, the sent report is totally anonymous. Even we don’t know who you are.

        <ul>
          <li>
            Only our developers can read the report
          </li>
          <li>
            All data is stored on the IOTA Tangle
          </li>
          <li>
            Personal information and IP addresses are redacted
          </li>
        </ul>
        <text-input :onEnter="sendReport" v-model="bugMessage" placeholder="Add optional message..."></text-input>
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
import ION from 'iota-ion.lib.js'
import TextInput from '@/components/TextInput.vue'

import {
  AtomSpinner
} from 'epic-spinners'

export default {
  props: ['onFinish', 'honestDebugger', 'iota'],
  components: {
    AtomSpinner,
    TextInput
  },
  methods: {
    ephemeralAddr(offset = 0) {
      var iota = this.iota
      var prefix = 'oc8O51fExaTji92E'
      var iotaSeed = ION.utils.tryteGen(prefix, ION.utils.tempKey(prefix, '8BA98FbHtHzzl8QI', undefined, 60 * 60 * 24, 0))
      var addr = iota.utils.addChecksum(iotaSeed)
      return addr
    },
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
      if(this.bugMessage.length > 0) {
        this.honestDebugger.messages.unshift({
          type: 'message',
          msg: this.bugMessage
        })
      }
      // Encrypt the whole thing using ECDH and filter out any sensitive data
      var securedLogs = this.honestDebugger.getSecuredLogs()

      // Convert to trytes
      var encryptedTrytes = iota.utils.toTrytes(JSON.stringify(securedLogs))
      var address = this.ephemeralAddr()
      console.log(`Sending bug report to`, address);
      var transfers = [{
        address,
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
      bugMessage: '',
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
