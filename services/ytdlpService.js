const { spawn } = require("child_process")

exports.info = function(url){

 return new Promise((resolve)=>{

  const proc = spawn("yt-dlp",["-J",url])

  let data=""

  proc.stdout.on("data",d=>data+=d)

  proc.on("close",()=>resolve(JSON.parse(data)))

 })

}
