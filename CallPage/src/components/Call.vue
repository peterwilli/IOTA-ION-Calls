<template lang="html">
  <div>
    <div class="full-view">
      <div class="videos">
        <user-video name="You" status="connected">
          <video ref="my_vid"></video>
        </user-video>
        <div class="others-vid-container" v-for="val, key in connections">
          <div v-if="val.status !== 'connected'" class="vid-status">
            <atom-spinner :color="'#90abad'" :size='90'></atom-spinner>
          </div>
          <video v-show="val.status === 'connected'" class="vid" :ref="'vid:' + key"></video>
        </div>
      </div>
    </div>
    <div class="messages">
      <div v-for="msg in messages" class="message">
        {{ msg.message }}
      </div>
    </div>
    <div class="chat">
      <input type="text" :disabled="Object.keys(connections).length > 0" @keyup.enter="say()" :placeholder="Object.keys(connections).length > 0 ? 'Type a message...' : 'Waiting for others to appear...'" v-model="message" />
    </div>
    <share-window v-if="Object.keys(connections).length === 0" :url="getConnectionUrl()"></share-window>
  </div>
</template>

<script>
import store from 'store'
import IOTA from 'iota.lib.js'
import Noty from 'noty'
import ION from 'iota-ion.lib.js'
import tryteGen from '@/utils/tryteGen.js'
import htmlEntities from '@/utils/html-entities.js'
import getUserMedia from '@/utils/getUserMedia.js'
import ShareWindow from '@/components/ShareWindow.vue'
import UserVideo from '@/components/UserVideo.vue'

export default {
  components: {
    ShareWindow,
    UserVideo
  },
  beforeDestroy() {
    if (this.ion !== null) {
      console.warn(`Destroyed ION`);
      this.ion.stop()
      this.ion = null
    }
  },
  async mounted() {
    var seed = this.$route.params.seed
    var iotaSeed = tryteGen(seed)
    if (this.$route.params.myTag) {
      this.myTag = this.$route.params.myTag
      console.log(`Call using ION ${ION.version}`);

      this.myStream = await getUserMedia({
        video: true,
        audio: true
      })
      this.$refs.my_vid.srcObject = this.myStream
      this.$refs.my_vid.volume = 0
      this.$refs.my_vid.play()
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
    async connect() {
      var _this = this
      var iota = new IOTA({
        provider: 'https://nodes.testnet.iota.org:443/'
      })
      _this.ion = new ION(iota, "xSzG20i5l5kwCHXm", this.$route.params.seed, this.myTag)
      _this.ion.connect({})
      _this.ion.on('error', (e) => {
        _this.status = 'error'
        _this.error = e
      })

      _this.ion.on('connect', (obj) => {
        _this.$set(_this.connections, obj.user, {
          peer,
          status: 'upgrading'
        })
        console.log('Connected! Upgrading connection to video chat, initiator:', _this.ion.peers[obj.user].initiator);
        var peer = new Peer({
          // Upgrade the Peer to video, we use the ION initiator election results to immediatly come up with an initiator.
          initiator: _this.ion.peers[obj.user].initiator,
          trickle: true,
          config: {
            iceServers: [{
              urls: 'stun:stun.xs4all.nl:3478'
            }, {
              urls: 'stun:stun1.l.google.com:19302'
            }, {
              urls: 'stun:stun2.l.google.com:19302'
            }, {
              urls: 'stun:stun.vodafone.ro:3478'
            }]
          }
        })
        _this.$set(_this.connections, obj.user, {
          peer,
          status: 'upgrading'
        })
        peer.on('signal', (data) => {
          console.log(`signal to ${obj.user}:`, JSON.stringify(data));
          _this.ion.send(obj.user, "signal:" + JSON.stringify(data))
        })
        peer.on('connect', async () => {
          _this.$set(_this.connections, obj.user, {
            peer,
            status: 'acquiring_stream'
          })

          peer.on('stream', (stream) => {
            const k = `vid:${obj.user}`
            _this.$refs[k][0].srcObject = stream
            _this.$refs[k][0].volume = 1
            _this.$refs[k][0].play()
            // TODO: Base this on person currently speaking
            _this.currentlyTalking = _this.connections[obj.user]

            _this.$set(_this.connections, obj.user, {
              peer,
              status: 'connected'
            })
          })

          peer.addStream(_this.myStream)
        })
      })

      _this.ion.on('close', (obj_) => {
        const { user } = obj_
        var connections = Object.assign({}, _this.connections)
        var conn = connections[user]
        conn.peer.destroy()
        delete connections[user]
        _this.connections = connections
      })

      _this.ion.on('data', (obj_) => {
        const { data, user } = obj_
        var otherPeer = _this.connections[user].peer
        var signalCmd = "signal:"
        var msgCmd = "msg:"
        if (data.indexOf(signalCmd) === 0) {
          otherPeer.signal(data.substring(signalCmd.length, data.length))
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
    }
  },
  data() {
    return {
      messages: [],
      ion: null,
      myTag: null,
      message: '',
      error: null,
      connections: {},
      myStream: null,
      currentlyTalking: null
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
  z-index 10
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
  bottom 100px
  height 250px
  text-align: center

  video {
    height 250px
    vertical-align: middle
    width 250px
    object-fit cover!important
  }

  .chat-vid {
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    object-fit cover!important
  }

  .my-vid-container, .others-vid-container {
    .vid {

    }
  }
}
</style>
