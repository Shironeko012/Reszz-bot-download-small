module.exports = async (sock, msg) => {

 const jid = msg.key.remoteJid

 const message = await sock.sendMessage(jid, {
  text: "Downloading 0%"
 })

 return async (p) => {

  const text = `Downloading ${p.percent}% | ${p.size}`

  await sock.sendMessage(jid, {
   text,
   edit: message.key
  })

 }

}
