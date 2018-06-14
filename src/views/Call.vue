<template lang="html">
  <div>
    <div class="full-view">
      <div class="videos">
        <video ref="chat_vid" class="chat-vid"></video>
        <div class="my-vid-container">
          <video ref="my_vid" class="my-vid"></video>
        </div>
      </div>
    </div>
    <div class="messages">
      <div v-for="msg in messages" class="message">
        {{ msg.message }}
      </div>
    </div>
    <div class="chat">
      <input type="text" :disabled="!connected" @keyup.enter="say()" :placeholder="connected ? 'Type a message...' : 'Waiting for others to appear...'" v-model="message" />
    </div>
    <share-window :url="getConnectionUrl()" v-if="!connected"></share-window>
  </div>
</template>

<script>
import IOTA from 'iota.lib.js'
import Noty from 'noty'
import ION from 'iota-ion.lib.js'
import tryteGen from '@/utils/tryteGen.js'
import htmlEntities from '@/utils/html-entities.js'
import iota from '@/utils/iota.js'
import ShareWindow from '@/components/ShareWindow.vue'
const nanoid = require('nanoid')
const Peer = require('simple-peer')

export default {
  components: {
    ShareWindow
  },
  mounted() {
    var seed = this.$route.params.seed
    var iotaSeed = tryteGen(seed)
    if (this.$route.params.myTag) {
      this.myTag = this.$route.params.myTag
      this.connect()
    } else {
      this.$router.replace({
        name: 'call-tag',
        params: {
          seed,
          myTag: ION.utils.randomTag()
        }
      })
    }
  },
  data() {
    return {
      messages: [],
      ion: null,
      myTag: null,
      message: "",
      connected: false
    }
  },
  methods: {
    say() {
      if (this.ion.peer) {
        this.ion.peer.send("msg:" + this.message)
        this.messages.push({
          message: this.message
        })
        this.message = ""
      }
    },
    getConnectionUrl() {
      return window.location.origin + "/#/call/" + this.$route.params.seed
    },
    connect() {
      var _this = this
      var iota = new IOTA({
        provider: 'https://nodes.testnet.iota.org:443/'
      })
      navigator.getUserMedia({
        video: true,
        audio: true
      }, (stream) => {
        _this.$refs.my_vid.srcObject = stream
        _this.$refs.my_vid.volume = 0
        _this.$refs.my_vid.play()

        _this.ion = new ION(iota, "zBicVg82Sgf45M6E", this.$route.params.seed, this.myTag)
        _this.ion.connect({})
        _this.ion.events.on('connect', () => {
          console.log('Connected! Moving to layer-2 (video chat via ION)');
          _this.connected = true
          _this.peer = new Peer({
            initiator: _this.ion.isInitiator,
            trickle: true
          })
          _this.ion.events.on('data', (data) => {
            data = data + ""
            console.log('[layer2] data:', data);
            var signalCmd = "signal:"
            var msgCmd = "msg:"
            if (data.indexOf(signalCmd) === 0) {
              _this.peer.signal((data + "").substring(signalCmd.length, data.length))
            } else if (data.indexOf(msgCmd) === 0) {
              var message = (data + "").substring(msgCmd.length, data.length)
              _this.messages.push({
                message
              })

              new Noty({
                text: htmlEntities(message),
                timeout: 2500,
                progressBar: true,
                layout: 'bottomCenter'
              }).show()
            }
          })
          _this.peer.on('signal', (data) => {
            console.log('[layer2] signal:', data);
            _this.ion.send("signal:" + JSON.stringify(data))
          })
          _this.peer.on('connect', () => {
            _this.peer.addStream(stream)
            _this.peer.on('stream', (stream) => {
              _this.$refs.chat_vid.srcObject = stream
              _this.$refs.chat_vid.play()
            })
          })
          _this.ion.flushCachedData();
          _this.ion.startRetrieving = true;
        })
      }, function() {})

    }
  }
}
</script>

<style lang="stylus" scoped>
.full-view {
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  background: #6dd6ff
}
.messages {
  position absolute
  left 0
  right 0
  top 0
  margin-bottom 50px
  margin-top 100%
  background #a7e7ff
  .message {
    padding 5px
    border-top 1px dotted  #fff
    border-bottom 1px dotted #36b0e0
  }
}
.chat {
  $chat-inner-color = #a7e7ff
  background #f1f1f1
  height 50px
  left 0
  right 0
  bottom 0
  position fixed
  padding 5px
  box-sizing border-box
  border-top 3px solid #fff
  -webkit-box-shadow: 0px -3px 0px 0px $chat-inner-color
  -moz-box-shadow:    0px -3px 0px 0px $chat-inner-color
  box-shadow:         0px -3px 0px 0px $chat-inner-color

  input {
    width 100%
    height 100%
    margin 0
    padding 0
    font-size 100%
    background transparent
    border 0
    outline none
  }
}
.videos {
  position absolute
  left 0
  right 0
  top 0
  bottom 0

  .chat-vid {
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    object-fit cover!important
  }

  .my-vid-container {
    position absolute
    // width: 15%
    height 15%
    left 15px
    bottom 65px
    min-height 150px
    // min-width 150px
    object-fit cover!important
    border 4px solid #fff
    overflow hidden

    .my-vid {
      height 100%
      object-fit cover!important
    }
  }
}
</style>
