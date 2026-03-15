const messageHandler = require("./messageHandler")

module.exports = (sock) => {

 sock.ev.on("messages.upsert", async ({ messages }) => {

  try {

   const msg = messages?.[0]

   if (!msg) return

   if (!msg.message) return

   if (msg.key?.remoteJid === "status@broadcast") return

   if (msg.message.protocolMessage) return

   await messageHandler(sock, msg)

  } catch (err) {

   console.log("EventHandler error:", err)

  }

 })

}
