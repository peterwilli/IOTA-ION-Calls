var readline = require('readline');
var IOTA = require('iota.lib.js');
var EC = require('elliptic').ec;
var ec = new EC('curve25519');
var CryptoJS = require("crypto-js")
var lzjs = require('lzjs')
import ION from 'iota-ion.lib.js'

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

class HonestDebuggerReader {
  constructor(iota, debugAddr) {
    this.debugAddr = debugAddr
    this.iota = iota
    this.bundlesScanned = {}
  }

  async getBundle(tailTx) {
    var iota = this.iota
    return new Promise(function(resolve, reject) {
      iota.api.getBundle(tailTx, (e, r) => {
        if (e) {
          reject(e)
        } else {
          resolve(r)
        }
      })
    })
  }

  async findTransactionObjects(searchValues) {
    var iota = this.iota
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

  async getBundles() {
    var searchValues = {
      addresses: [this.debugAddr]
    }
    var txs = await this.findTransactionObjects(searchValues)
    var bundles = []
    for (var tx of txs) {
      if (tx.currentIndex === 0) {
        if(!this.bundlesScanned[tx.bundle]) {
          var bundle = await this.getBundle(tx.hash)
          if (bundle != null) {
            bundles.push(bundle)
            this.bundlesScanned[tx.bundle] = true
          }
        }
        break
      }
    }
    return bundles
  }

  decodeBundle(bundle, privateKey) {
    var json = this.iota.utils.extractJson(bundle)
    return this.decodeJSON(JSON.parse(json), privateKey)
  }

  decodeJSON(json, privateKey) {
    var publicKey = ec.keyFromPublic(json.publicKey, 'hex').getPublic()
    var encryptionKey = privateKey.derive(publicKey).toString(16)

    // To eliminate any weak bits from Diffie-Helman
    encryptionKey = CryptoJS.SHA256(encryptionKey).toString()
    var decryptedLogs = CryptoJS.AES.decrypt(json.enc, encryptionKey).toString(CryptoJS.enc.Utf8)
    var decompressedLogs = lzjs.decompress(decryptedLogs)

    return decompressedLogs
  }

  decodeBundles(bundles, privateKey) {
    var key = ec.keyFromPrivate(privateKey, 'hex')
    var ret = []
    for(var bundle of bundles) {
      try {
        ret.push(this.decodeBundle(bundle, key))
      } catch (e) {
        console.error('Error (ignored):', e);
      } finally {
      }
    }
    return ret
  }
}

function ephemeralAddr(iota, offset = 0) {
  var prefix = 'oc8O51fExaTji92E'
  var iotaSeed = ION.utils.tryteGen(prefix, ION.utils.tempKey(prefix, '8BA98FbHtHzzl8QI', undefined, 60 * 60 * 24, 0))
  var addr = iota.utils.addChecksum(iotaSeed)
  return addr
}

console.log('Please paste your HonestDebugger private key:');
rl.on('line', async function(privateKey){
  const iota = new IOTA({
    provider: 'https://nodes.testnet.iota.org:443/'
  })
  var debugAddr = ephemeralAddr(iota, 0)
  console.log('Reading from', debugAddr);
  var reader = new HonestDebuggerReader(iota, debugAddr)
  var bundles = await reader.getBundles()
  var decodedBundles = reader.decodeBundles(bundles, privateKey)
  console.log('decodedBundles', decodedBundles);
})
