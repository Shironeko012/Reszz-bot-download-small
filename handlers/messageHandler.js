const commandHandler = require("./commandHandler")
const config = require("../config")
const rateLimiter = require("../systems/rateLimiter")

module.exports = async (sock, msg) => {

 const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text
 if (!text) return

 if (!text.startsWith(config.prefix)) return

 const jid = msg.key.participant || msg.key.remoteJid

 if (!rateLimiter(jid)) {

  return sock.sendMessage(msg.key.remoteJid, {
   text: "Rate limit exceeded"
  })

 }

 const args = text.slice(config.prefix.length).trim().split(" ")

 const command = args.shift().toLowerCase()

 commandHandler(sock, msg, command, args)

}
