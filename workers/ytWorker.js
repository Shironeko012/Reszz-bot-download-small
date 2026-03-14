const { parentPort, workerData } = require("worker_threads")
const { spawn } = require("child_process")
const fs = require("fs")

const id = Date.now()
const base = `temp/${id}`

let args = [
 workerData.url,
 "-o", `${base}.%(ext)s`,
 "--newline"
]

if(workerData.type === "video"){
 args.push("-f","best[height<=360]")
}

if(workerData.type === "audio"){
 args.push("-x","--audio-format","mp3")
}

const proc = spawn("yt-dlp",args)

proc.stdout.on("data",(d)=>{

 const text = d.toString()

 const match = text.match(/(\d+\.\d+)%.*of\s+([0-9.]+\w+)/)

 if(match){

  parentPort.postMessage({
   progress:{
    percent:match[1],
    size:match[2]
   }
  })

 }

})

proc.on("close",()=>{

 const file = fs.readdirSync("temp")
  .find(f => f.startsWith(String(id)))

 if(!file){
  parentPort.postMessage({done:false})
  return
 }

 parentPort.postMessage({
  done:true,
  path:"temp/"+file
 })

})
