var Peer = require('simple-peer')
var CryptoJS = require("crypto-js")
import iota from '@/utils/iota.js'
import seedGen from '@/utils/seedGen.js'
const nanoid = require('nanoid')
var EventEmitter = require('eventemitter3')
var LZString = require('lz-string')

export default class ION {
  constructor(encryptionKey, addr) {
    this.addr = addr
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
      initiator,
      initiatorSignal
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
    var _this = this
    p.once('signal', function(data) {
      console.log('signal', data);
      var signalEncrypted = _this.encrypt(JSON.stringify(data))
      var seed = seedGen(nanoid(128))
      var transfers = [{
        address: _this.addr,
        value: 0,
        message: iota.utils.toTrytes(atob(signalEncrypted)) + "E"
      }]
      return new Promise(function(resolve, reject) {
        iota.api.sendTransfer(seed, _this.depth, _this.minWeightMagnitude, transfers, (e, r) => {
          console.log('sent transfer', data, e, r);
          if (e) {
            reject(e)
          } else {
            resolve(r)
          }
        })
      });
    })

    if (initiatorSignal) {
      p.signal(initiatorSignal)
    }
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
        setTimeout(fn, 1000)
      }
      setTimeout(fn, 1000)
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

  async connect(options) {
    // First check if already a tx was done
    var searchValues = {
      addresses: [this.addr]
    }
    var txs = await this.findTransactionObjects(searchValues)
    if (txs.length > 1) {
      // If there is more than 1 tx, the address has been used before, and we will increase our address by 1
      var newAddr = iota.utils.addChecksum(this.increaseTryte(iota.utils.noChecksum(this.addr)))
      console.warn(`Address ${this.addr} is dirty! Moving to a new address: ${newAddr}`)
      this.addr = newAddr
      return await this.connect(options)
    }
    console.log('updat5');
    if (txs.length == 0) {
      // We are initiator
      var r = await this.startPeer({
        initiator: true
      })

      // Stupid hack: Wait for answer twice so ION ignores the first (our initiator) tx
      var newTx = await this.waitForAnswer()
      newTx = await this.waitForAnswer()

      var frag = newTx.signatureMessageFragment
      var msg = iota.utils.fromTrytes(frag.substring(0, frag.lastIndexOf("E")))
      var signal = JSON.parse(this.decrypt(btoa(msg)))
      console.log('signal', signal);
      this.peer.signal(signal)
    } else {
      // We are a participant
      var frag = txs[0].signatureMessageFragment
      var msg = iota.utils.fromTrytes(frag.substring(0, frag.lastIndexOf("E")))
      var initiatorSignal = JSON.parse(this.decrypt(btoa(msg)))
      console.log('initiatorSignal', initiatorSignal);
      var r = await this.startPeer({
        initiator: false,
        initiatorSignal
      })
    }
  }
}
