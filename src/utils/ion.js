var Peer = require('simple-peer')
var CryptoJS = require("crypto-js")
import iota from '@/utils/iota.js'
import tryteGen from '@/utils/tryteGen.js'
const nanoid = require('nanoid')
var EventEmitter = require('eventemitter3')
var LZString = require('lz-string')

export default class ION {
  constructor(encryptionKey, addr, myTag) {
    this.addr = addr
    this.myTag = myTag
    this.encryptionKey = encryptionKey
    this.minWeightMagnitude = 9
    this.depth = 5
    this.txsScanned = {}
    this.events = new EventEmitter()
  }

  async findTransactionObjects(searchValues) {
    return new Promise(function(resolve, reject) {
      iota.api.findTransactionObjects(searchValues, (e, r) => {
        if (e) {
          reject(e)
        } else {
          resolve(r)
        }
      })
    })
  }

  encrypt(msg) {
    return CryptoJS.AES.encrypt(msg, this.encryptionKey).toString()
  }

  decrypt(msg) {
    return CryptoJS.AES.decrypt(msg, this.encryptionKey).toString(CryptoJS.enc.Utf8)
  }

  async startPeer(options) {
    var {
      initiator
    } = options
    var p = new Peer({
      initiator,
      trickle: false,
      reconnectTimer: 5000,
      config: { iceServers: [ { urls: 'stun:stun2.l.google.com:19302' }, { urls: 'stun:stun3.l.google.com:19302' }, { urls: 'stun:stun3.l.google.com:19302' } ] }
    })
    this.peer = p
    this.events.emit('peer-added')
    p.on('error', function(err) {
      console.error('peer error', err)
    })
  }

  async waitForAnswer() {
    var searchValues = {
      addresses: [this.addr]
    }
    var _this = this
    return new Promise(function(resolve, reject) {
      var fn = async () => {
        var txs = await _this.findTransactionObjects(searchValues)
        for (var tx of txs) {
          if (!_this.txsScanned[tx.hash]) {
            _this.txsScanned[tx.hash] = true
            return resolve(tx)
          }
        }
        setTimeout(fn, 3000)
      }
      setTimeout(fn, 3000)
    })
  }

  increaseTryte(trytes) {
    var setCharAt = (str, index, chr) => {
      if (index > str.length - 1) return str;
      return str.substr(0, index) + chr + str.substr(index + 1);
    }

    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9"
    for (var i = 0; i < trytes.length; i++) {
      var nextChar = alphabet.indexOf(trytes[i]) + 1
      if (nextChar >= alphabet.length) {
        // We go outside alphabet, reset current to zero and increase the next
        trytes = setCharAt(trytes, i, alphabet[0])
      }
      else {
        trytes = setCharAt(trytes, i, alphabet[nextChar])
        break
      }
    }

    return trytes
  }

  processTx(tx) {
    var frag = tx.signatureMessageFragment
    var msg = iota.utils.fromTrytes(frag.substring(0, frag.lastIndexOf("E")))
    var signal = null
    try {
      signal = JSON.parse(this.decrypt(btoa(msg)))
    }
    catch (e) {
      window.IONDebug = {
        decrypt: this.decrypt
      }
      console.error('Error parsing this message:', msg, frag)
    }
    finally {
      if(signal !== null) {
        console.log('processTx > signal', signal);
        this.peer.signal(signal)
      }
    }
  }

  async connect(options) {
    // First check if already a tx was done
    var searchValues = {
      addresses: [this.addr]
    }
    var txs = await this.findTransactionObjects(searchValues)
    console.log('initiator', (txs.length === 0 || txs[0].tag.indexOf(this.myTag) === 0));
    this.startPeer({
      initiator: (txs.length === 0 || txs[0].tag.indexOf(this.myTag) === 0)
    })

    var shouldCreateTx = true
    for(var tx of txs) {
      this.txsScanned[tx.hash] = true
      if(tx.tag.indexOf(this.myTag) !== 0) {
        // Is not mine, so we interpret it
        this.processTx(tx)
      }
      else {
        shouldCreateTx = false
      }
    }
    var _this = this
    var p = this.peer
    var connected = false
    var checkAnswer = () => {
      _this.waitForAnswer().then((newTx) => {
        if(newTx.tag.indexOf(_this.myTag) !== 0) {
          _this.processTx(newTx)
        }
        if(!connected) {
          setTimeout(checkAnswer, 500)
        }
      })
    }
    checkAnswer()
    p.once('connect', () => {
      connected = true
    })
    if(shouldCreateTx) {
      console.log('in shouldCreateTx');
      p.on('signal', function(data) {
        console.log('signal', data);
        var signalEncrypted = _this.encrypt(JSON.stringify(data))
        var seed = tryteGen(nanoid(128))
        var transfers = [{
          tag: _this.myTag,
          address: _this.addr,
          value: 0,
          message: iota.utils.toTrytes(atob(signalEncrypted)) + "E"
        }]
        iota.api.sendTransfer(seed, _this.depth, _this.minWeightMagnitude, transfers, (e, r) => {
          console.log('sent transfer', data, e, r);
        })
      })
    }
  }
}
