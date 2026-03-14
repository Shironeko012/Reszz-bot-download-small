const dl = require("../commands/dl")
const mp3 = require("../commands/mp3")
const help = require("../commands/help")

module.exports = (sock, msg, cmd, args) => {

 switch (cmd) {

  case "dl":
   return dl(sock, msg, args)

  case "mp3":
   return mp3(sock, msg, args)

  case "help":
   return help(sock, msg)

 }

}
