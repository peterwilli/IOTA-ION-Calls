var uncaught = require('uncaught')
var EC = require('elliptic').ec;
var ec = new EC('curve25519');
var CryptoJS = require("crypto-js")
var lzjs = require('lzjs')
var debounce = require('debounce')

export default class HonestDebugger {
  constructor(publicKey) {
    this.filters = []
    this.messages = []
    this.oldConsole = null
    this.keep = 0
    this.key = ec.genKeyPair()
    this.publicKey = ec.keyFromPublic(publicKey, 'hex').getPublic()
    this.encryptionKey = this.key.derive(this.publicKey).toArray().map(String.fromCharCode).join("")
    this.cleanOldLogs = debounce(() => {
      if(this.keep > 0 && this.messages.length > this.keep) {
        this.messages = this.messages.slice(this.messages.length - this.keep, this.messages.length)
      }
    }, 100)

    // To eliminate any weak bits from Diffie-Helman
    this.encryptionKey = CryptoJS.SHA256(this.encryptionKey).toString()
  }

  getRawFilteredLogs() {
    var rawLogs = JSON.stringify(this.messages)
    rawLogs = this.filter(rawLogs)
    return rawLogs
  }

  getSecuredLogs() {
    var rawLogs = this.getRawFilteredLogs();
    var compressedLogs = lzjs.compress(rawLogs);
    this.oldConsole.log('lengths', rawLogs.length, compressedLogs.length);
    var encryptedLogs = CryptoJS.AES.encrypt(compressedLogs, this.encryptionKey).toString()
    return {
      publicKey: this.key.getPublic().encode('hex'),
      enc: encryptedLogs
    }
  }

  filter(rawLogs) {
    for(var filter of this.filters) {
      rawLogs = rawLogs.replace(filter, '***')
    }
    return rawLogs
  }

  start() {
    // capture old console
    this.oldConsole = window.console;

    // define a new console
    var _this = this
    var console = (function() {
      var {oldConsole, messages} = _this
      var functions = {};
      ['log', 'error', 'info', 'warn'].forEach((k) => {
        functions[k] = (...msg) => {
          messages.push({
            timestamp: new Date().toISOString(),
            type: k,
            msg
          });
          _this.cleanOldLogs()
          oldConsole[k](...msg);
        }
      });
      return functions;
    }(window.console));
    window.console = console;

    uncaught.start();
    uncaught.addListener(function(error) {
      console.error('Uncaught error or rejection: ', error.message);
    });
  }

  stop() {
    window.console = oldConsole;
    uncaught.stop();
  }
}
