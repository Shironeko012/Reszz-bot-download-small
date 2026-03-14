module.exports = async (sock, msg) => {

 const text = `
Downloader Bot

.dl <url>   → video
.mp3 <url>  → audio
`

 await sock.sendMessage(msg.key.remoteJid, { text })

}

