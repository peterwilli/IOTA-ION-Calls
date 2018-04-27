const seedRandom = require('seed-random')

export default (seed) => {
  var length = 81;
  var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9";
  var result = [];
  var rnd = seedRandom(seed);

  for(var i = 0; i < length; i++) {
    var num = Math.round(rnd() * charset.length)
    result.push(charset[num % charset.length])
  }

  return result.join("")
};
