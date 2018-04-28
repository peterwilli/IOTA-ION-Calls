<template lang="html">
  <div class="full-view">
    <div class="videos">
      <video ref="chat_vid" class="chat-vid"></video>
      <video ref="my_vid" class="my-vid"></video>
    </div>
  </div>
</template>

<script>
import ION from '@/utils/ion.js'
import seedGen from '@/utils/seedGen.js'
import iota from '@/utils/iota.js'
export default {
  mounted() {
    var seed = this.$route.params.seed
    var iotaSeed = seedGen(seed)
    var addr = iota.utils.addChecksum(iotaSeed)
    this.addr = addr
    console.log(addr, seed)

    this.connect()
  },
  data() {
    return {
      ion: null,
      addr: null
    }
  },
  methods: {
    connect() {
      var _this = this
      navigator.getUserMedia({
        video: true,
        audio: true
      }, (stream) => {
        _this.$refs.my_vid.srcObject = stream
        _this.$refs.my_vid.volume = 0
        _this.$refs.my_vid.play()

        this.ion = new ION(this.$route.params.seed, this.addr)
        this.ion.connect({})
        this.ion.events.on('peer-added', () => {
          _this.ion.peer.on('connect', () => {
            console.log('on connect!');
            _this.ion.peer.on('data', function(data) {
              var signalCmd = "signal:"
              if (data.indexOf(signalCmd) === 0) {
                _this.ion.peer.signal((data + "").substring(signalCmd.length, data.length))
              }
            })
            _this.ion.peer.on('signal', (data) => {
              _this.ion.peer.send("signal:" + JSON.stringify(data))
            })
            _this.ion.peer.addStream(stream)
          })
          _this.ion.peer.on('stream', (stream) => {
            _this.$refs.chat_vid.srcObject = stream
            _this.$refs.chat_vid.play()
          })
        })
      }, function() {})

    }
  }
}
</script>

<style lang="stylus" scoped>
.videos {
  display inline-block
  position relative
  margin 0 auto

  .my-vid {
    position absolute
    width: 10%
    height: 10%
    left 15px
    bottom 15px

	border: 4px solid #e0e0e0;
	-moz-box-shadow:
		0px 0px 5px rgba(071,071,071,1),
		inset 0px 0px 1px rgba(000,000,000,1);
	-webkit-box-shadow:
		0px 0px 5px rgba(071,071,071,1),
		inset 0px 0px 1px rgba(000,000,000,1);
	box-shadow:
		0px 0px 5px rgba(071,071,071,1),
		inset 0px 0px 1px rgba(000,000,000,1);
	text-shadow:
		0px -1px 0px rgba(000,000,000,0.2),
		0px 1px 0px rgba(255,255,255,1);

  }
}
</style>
