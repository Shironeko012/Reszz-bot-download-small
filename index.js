const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")
const fs = require("fs")
const path = require("path")

const logger = require("./utils/logger")
const eventHandler = require("./handlers/eventHandler")
const antiCrash = require("./systems/antiCrash")

/*
====================
START BOT
====================
*/

async function start() {

 try {

  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({

   version,

   auth: state,

   logger: logger.child({ level: "silent" }),

   browser: ["Downloader", "Bot", "Production"],

   markOnlineOnConnect: true,

   syncFullHistory: false

  })

  /*
  ====================
  SAVE SESSION
  ====================
  */

  sock.ev.on("creds.update", saveCreds)

  /*
  ====================
  CONNECTION UPDATE
  ====================
  */

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {

   if (qr) {
    qrcode.generate(qr, { small: true })
    logger.info("QR RECEIVED - Scan to login")
   }

   if (connection === "connecting") {
    logger.info("Connecting to WhatsApp...")
   }

   if (connection === "open") {
    logger.info("BOT CONNECTED")
   }

   if (connection === "close") {

    const reason = lastDisconnect?.error?.output?.statusCode

    logger.warn("Connection closed:", reason)

    if (reason !== DisconnectReason.loggedOut) {

     logger.info("Reconnecting in 5 seconds...")
     setTimeout(start, 5000)

    } else {

     logger.error("Logged out. Scan QR again.")

    }

   }

  })

  /*
  ====================
  MESSAGE HANDLER
  ====================
  */

  eventHandler(sock)

 } catch (err) {

  logger.error("START ERROR:", err)

  setTimeout(start, 5000)

 }

}

/*
====================
TEMP FOLDER
====================
*/

if (!fs.existsSync("./temp")) {
 fs.mkdirSync("./temp")
}

/*
====================
TEMP CLEANER
====================
*/

setInterval(() => {

 try {

  const files = fs.readdirSync("./temp")

  files.forEach(file => {

   const full = path.join("./temp", file)

   const stat = fs.statSync(full)

   if (Date.now() - stat.mtimeMs > 7200000) {

    fs.unlinkSync(full)

    logger.info("Deleted temp:", file)

   }

  })

 } catch (err) {

  logger.error("Temp cleanup error:", err)

 }

}, 600000)

/*
====================
ANTI CRASH
====================
*/

if (antiCrash) antiCrash()

/*
====================
RUN BOT
====================
*/

start()
