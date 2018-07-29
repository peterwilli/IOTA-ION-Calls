var uncaught = require('uncaught')
var EC = require('elliptic').ec;
var ec = new EC('curve25519');
var CryptoJS = require("crypto-js")

export class HonestDebugger {
  constructor(publicKey) {
    this.filters = []
    this.messages = []
    this.oldConsole = null
    this.key = ec.genKeyPair()
    this.publicKey = ec.keyFromPublic(publicKey, 'hex')
    this.encryptionKey = this.key.derive(this.publicKey)
  }

  getRawFilteredLogs() {
    var _this = this
    var messages = messages.map((msg) => {
      return _this.filter(msg)
    })
    return messages
  }

  getSecuredLogs() {
    return {
      enc: CryptoJS.AES.encrypt(JSON.stringify(this.getRawFilteredLogs()), this.encryptionKey).toString()
    }
  }

  filter(msg) {
    for(var filter of this.filters) {
      msg = msg.replace(filter, '')
    }
    return msg
  }

  start() {
    // define a new console
    var _this = this
    var console = (function() {
      var {oldConsole, messages} = _this
      var functions = {}
      for(var k of ['log', 'error', 'info', 'warn']) {
        functions[k] = (msg) => {
          messages.push({
            type: k,
            msg
          })
          oldConsole[k](msg)
        }
      }
      return functions;
    }(window.console));

    //Then redefine the old console
    this.oldConsole = window.console;
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
