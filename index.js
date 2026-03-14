const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")
const fs = require("fs")

const logger = require("./utils/logger")
const eventHandler = require("./handlers/eventHandler")
const antiCrash = require("./systems/antiCrash")

async function start() {

 const { state, saveCreds } = await useMultiFileAuthState("./session")

 const sock = makeWASocket({
  auth: state,
  logger: logger.child({ level: "silent" })
 })

 sock.ev.on("creds.update", saveCreds)

 eventHandler(sock)

 sock.ev.on("connection.update", ({ connection, qr }) => {

  if (qr) qrcode.generate(qr, { small: true })

  if (connection === "open") {
   logger.info("BOT CONNECTED")
  }

 })

}

if (!fs.existsSync("./temp")) fs.mkdirSync("./temp")

antiCrash()

setInterval(() => {

 const files = fs.readdirSync("./temp")

 files.forEach(f => {

  const p = "./temp/" + f
  const stat = fs.statSync(p)

  if (Date.now() - stat.mtimeMs > 7200000) {
   fs.unlinkSync(p)
  }

 })

}, 600000)

start()
