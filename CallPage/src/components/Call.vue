<template lang="html">
  <div v-if="correctlyLoaded">
    <div class="full-view">
      <div class="videos">
        <user-video :on-update="videoUpdated" :name="user.name" status="connected">
          <video ref="my_vid"></video>
        </user-video>
        <user-video :on-update="videoUpdated" v-for="val, key in connections" :key="key" :name="val.name" :status="val.status">
          <video v-show="val.status === 'connected'" :ref="'vid:' + key"></video>
        </user-video>
      </div>
      <share-window v-if="Object.keys(connections).length === 0" :url="getConnectionUrl()"></share-window>
      <div class="chat">
        <text-input :onEnter="say" v-model="message" :placeholder="Object.keys(connections).length > 0 ? 'Type a message...' : 'Waiting for others to appear...'" :disabled="Object.keys(connections).length > 0"></text-input>
      </div>
    </div>
    <div class="messages">
      <div class="inner">
        <div v-for="msg in messages" :key="'msg' + blake2sHex(msg.message)" class="message">
          <span class="from">{{ msg.from }}:</span>
          <span class="content"><linkified-text :text="msg.message"></linkified-text></span>
        </div>
      </div>
    </div>
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
import TextInput from '@/components/TextInput.vue'
import LinkifiedText from '@/components/LinkifiedText.vue'
var CryptoJS = require("crypto-js")

const blake = require('blakejs')
const Peer = ION.utils.Peer

export default {
  props: ['honestDebugger', 'iota'],
  components: {
    UserVideo,
    ShareWindow,
    TextInput,
    LinkifiedText
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
      this.correctlyLoaded = true
      this.loadUser()
      if(this.user) {
        console.log(`Room seed (hashed):`, CryptoJS.SHA256("F3lqm6NQXrtrt6XNkudXFraUUOBW0rGs" + seed).toString());
        this.myTag = this.$route.params.myTag
        this.honestDebugger.filters.push(new RegExp(this.myTag, 'g'))
        this.honestDebugger.filters.push(new RegExp(this.$route.params.seed, 'g'))
        console.log(`Call using ION ${ION.version}`);

        this.myStream = await getUserMedia({
          video: true,
          audio: true
        })
        this.$refs.my_vid.srcObject = this.myStream
        this.$refs.my_vid.volume = 0
        this.$refs.my_vid.play()
        this.connect()
      }
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
    blake2sHex(msg) {
      return blake.blake2sHex(msg)
    },
    loadUser() {
      this.user = store.get('user')
    },
    say() {
      var json = {
        from: this.user.name,
        message: this.message
      }
      var jsonStr = JSON.stringify(json)
      this.ion.broadcast("msg:" + jsonStr)
      this.messages.unshift(json)
      this.message = ""
    },
    videoUpdated() {
      // Nothing, for now
    },
    getConnectionUrl() {
      return window.location.href.substring(0, window.location.href.indexOf("#")) + "#/" + this.$route.params.seed
    },
    onChangeNickname() {
      this.loadUser()
      var jsonStr = "intro:" + JSON.stringify({ name: this.user.name })
      console.log('onChangedUsername, broadcasting', jsonStr);
      this.ion.broadcast(jsonStr)
    },
    async connect() {
      var _this = this
      var iota = _this.iota
      _this.ion = new ION(iota, "xSzG20i5l5kwCHXm", this.$route.params.seed, this.myTag)
      _this.ion.connect({})
      _this.ion.on('error', (e) => {
        _this.status = 'error'
        _this.error = e
      })

      _this.ion.on('connect', (obj) => {
        var jsonStr = "intro:" + JSON.stringify({ name: _this.user.name })
        console.log('sending', jsonStr, 'to', obj.user);
        _this.ion.send(obj.user, jsonStr)
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
          var newConn = Object.assign({}, _this.connections[obj.user])
          newConn.status = 'acquiring_stream'
          _this.connections[obj.user] = newConn

          peer.on('stream', (stream) => {
            const k = `vid:${obj.user}`
            _this.$refs[k][0].srcObject = stream
            _this.$refs[k][0].volume = 1
            _this.$refs[k][0].play()
            // TODO: Base this on person currently speaking
            _this.currentlyTalking = _this.connections[obj.user]

            var newConn = Object.assign({}, _this.connections[obj.user])
            newConn.status = 'connected'
            _this.connections[obj.user] = newConn
          })

          peer.addStream(_this.myStream)
        })
      })

      _this.ion.on('close', (obj_) => {
        const { user } = obj_
        var connections = Object.assign({}, _this.connections)
        var conn = connections[user]
        if(conn && conn.peer) {
          conn.peer.destroy()
        }
        delete connections[user]
        _this.connections = connections
      })

      _this.ion.on('data', (obj_) => {
        const { data, user } = obj_
        var otherPeer = _this.connections[user].peer
        var signalCmd = "signal:"
        var msgCmd = "msg:"
        var introCmd = "intro:"

        if (data.indexOf(signalCmd) === 0) {
          otherPeer.signal(data.substring(signalCmd.length, data.length))
        } else if (data.indexOf(introCmd) === 0) {
          var json = data.substring(introCmd.length, data.length)
          json = JSON.parse(json)
          var newConn = Object.assign({}, _this.connections[user])
          newConn.name = json.name
          _this.connections[user] = newConn
        } else if (data.indexOf(msgCmd) === 0) {
          var json = data.substring(msgCmd.length, data.length)
          json = JSON.parse(json)
          _this.messages.unshift({
            message: json.message,
            from: json.from
          })

          new Noty({
            text: htmlEntities(`${json.from}: ${json.message}`).replace(/(http:\/\/[^\s]+)/g, "<a href='$1'>$1</a>"),
            timeout: 2500,
            progressBar: true,
            layout: 'topCenter'
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
      currentlyTalking: null,
      user: null,
      correctlyLoaded: false
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
  bottom 0
  z-index 999

  .inner {
    position absolute
    left 15px
    right 15px
    top 100%
    border-radius: 25px
    box-shadow 0px 0px 100px 0px rgba(0, 0, 0, 0.3)
    margin-bottom 100px

    /*&:after {
      content: ' '
      position absolute
      left 0
      right 0
      top 0
      bottom 0
      background: #fff
      opacity 0.5
      backdrop-filter: blur(10px)
      -webkit-backdrop-filter: blur(10px)
    }*/
  }

  a {
    color: #fff!important
  }

  .message {
    border 1px solid rgba(104, 220, 255, 0.3)
    background rgba(0, 0, 0, 0.4)
    color #fff
    padding 15px
    border-bottom 0

    .from {
      font-weight bold
      padding-right 10px
    }
  }
  .message:first-child {
    border-top-left-radius 25px
    border-top-right-radius 25px
  }
  .message:last-child {
    border-bottom-left-radius 25px
    border-bottom-right-radius 25px
    border-bottom 1px solid rgba(104, 220, 255, 0.56)
  }
}
.chat {
  height 50px
  left 0
  right 0
  bottom 0
  position fixed
  z-index 100
  padding 15px
}
.videos {
  position absolute
  left 0
  right 0
  bottom 100px
  height 250px
  z-index 5

  display flex
  justify-content center

  .user-video {
    margin-left 50px
  }
  .user-video:first-child {
    margin-left 0
  }

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
}
</style>
