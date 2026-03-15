const commandHandler = require("./commandHandler")
const config = require("../config")
const rateLimiter = require("../systems/rateLimiter")

module.exports = async (sock, msg) => {

 try {

  if (!msg) return
  if (!msg.message) return

  const type = Object.keys(msg.message)[0]

  if (!type) return

  // ignore broadcast
  if (msg.key?.remoteJid === "status@broadcast") return

  // ignore system messages
  if (type === "protocolMessage") return
  if (type === "reactionMessage") return
  if (type === "senderKeyDistributionMessage") return

  // universal message text parser
  const text =
   msg.message.conversation ||
   msg.message.extendedTextMessage?.text ||
   msg.message.imageMessage?.caption ||
   msg.message.videoMessage?.caption ||
   msg.message.buttonsResponseMessage?.selectedButtonId ||
   msg.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
   msg.message.templateButtonReplyMessage?.selectedId ||
   ""

  if (!text) return

  const prefix = config.prefix

  if (!text.startsWith(prefix)) return

  const jid = msg.key?.participant || msg.key?.remoteJid

  if (!jid) return

  if (!rateLimiter(jid)) {

   return sock.sendMessage(msg.key.remoteJid, {
    text: "Rate limit exceeded"
   })

  }

  const args = text.slice(prefix.length).trim().split(/\s+/)

  const command = args.shift()?.toLowerCase()

  if (!command) return

  await commandHandler(sock, msg, command, args)

 } catch (err) {

  console.log("MessageHandler error:", err)

 }

}
