const commandHandler = require("./commandHandler")
const config = require("../config")
const rateLimiter = require("../systems/rateLimiter")

module.exports = async (sock, msg) => {

 try {

  if (!msg) return
  if (!msg.message) return

  const type = Object.keys(msg.message)[0]

  if (!type) return

  if (msg.key?.remoteJid === "status@broadcast") return

  if (type === "protocolMessage") return
  if (type === "reactionMessage") return
  if (type === "senderKeyDistributionMessage") return

  const text =
   msg.message.conversation ||
   msg.message.extendedTextMessage?.text ||
   msg.message.imageMessage?.caption ||
   msg.message.videoMessage?.caption ||
   ""

  if (!text) return

  if (!text.startsWith(config.prefix)) return

  const jid = msg.key.participant || msg.key.remoteJid

  if (!rateLimiter(jid)) {

   return sock.sendMessage(msg.key.remoteJid, {
    text: "Rate limit exceeded"
   })

  }

  const args = text.slice(config.prefix.length).trim().split(/\s+/)

  const command = args.shift().toLowerCase()

  await commandHandler(sock, msg, command, args)

 } catch (err) {

  console.log("MessageHandler error:", err)

 }

}
