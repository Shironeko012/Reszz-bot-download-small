const messageHandler = require("./messageHandler")

module.exports = (sock) => {

 sock.ev.on("messages.upsert", async ({ messages }) => {

  const msg = messages[0]

  if (!msg.message) return

  messageHandler(sock, msg)

 })

}
