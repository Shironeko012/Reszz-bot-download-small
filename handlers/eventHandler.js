const messageHandler = require("./messageHandler")

module.exports = (sock) => {

 sock.ev.on("messages.upsert", async ({ messages }) => {

  try {

   if (!messages) return
   if (!Array.isArray(messages)) return

   const msg = messages[0]

   if (!msg) return
   if (!msg.message) return

   // ignore broadcast
   if (msg.key?.remoteJid === "status@broadcast") return

   // ignore system messages
   if (msg.message.protocolMessage) return
   if (msg.message.reactionMessage) return
   if (msg.message.senderKeyDistributionMessage) return
   if (msg.message.messageContextInfo) return

   await messageHandler(sock, msg)

  } catch (err) {

   console.log("EventHandler error:", err)

  }

 })

}
