<template lang="html">
  <video ref="chat_vid"></video>
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
      navigator.getUserMedia({
        video: true,
        audio: true
      }, (stream) => {
        this.ion = new ION(this.$route.params.seed, this.addr)
        this.ion.connect({})
        var _this = this
        this.ion.events.on('peer-added', () => {
          _this.ion.peer.on('connect', () => {
            _this.ion.peer.on('data', function(data) {
              var signalCmd = "signal:"
              if(data.indexOf(signalCmd) === 0) {
                _this.ion.peer.signal((data + "").substring(signalCmd.length, data.length))
              }
            })
            _this.ion.peer.on('signal', (data) => {
              _this.ion.peer.send("signal:" + JSON.stringify(data))
            })
            _this.ion.peer.addStream(stream)
          })
          _this.ion.peer.on('stream', (stream) => {
            console.log('stream', stream);
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
</style>
