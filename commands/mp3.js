const workerPool = require("../workers/workerPool")
const progressBar = require("../utils/progressBar")
const linkConverter = require("../systems/linkConverter")
const validator = require("../utils/validator")
const fileLimiter = require("../systems/fileLimiter")
const fs = require("fs")

module.exports = async (sock,msg,args)=>{

 let url = args[0]

 if(!validator(url)){
  return sock.sendMessage(msg.key.remoteJid,{text:"Invalid URL"})
 }

 url = await linkConverter.convert(url)

 const progress = await progressBar(sock,msg)

 const result = await workerPool.download(url,"audio",progress)

 if(!result || !result.path){
  return sock.sendMessage(msg.key.remoteJid,{text:"Download gagal"})
 }

 const stat = fs.statSync(result.path)

 if(!fileLimiter(stat.size)){

  fs.unlinkSync(result.path)

  return sock.sendMessage(msg.key.remoteJid,{
   text:"File lebih dari 50MB"
  })

 }

 await sock.sendMessage(msg.key.remoteJid,{
  audio:{url:result.path},
  mimetype:"audio/mpeg"
 })

}
