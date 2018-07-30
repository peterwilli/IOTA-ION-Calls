var EC = require('elliptic').ec;
var ec = new EC('curve25519');
// Generate keys
var key = ec.genKeyPair();
var pubPoint = key.getPublic();

console.log('Private:', key.getPrivate().toString("hex"));
console.log('Public: ', pubPoint.encode('hex'));
