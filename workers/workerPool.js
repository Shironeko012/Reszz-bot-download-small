const { Worker } = require("worker_threads")
const path = require("path")

exports.download = function(url,type,progress){

 return new Promise((resolve,reject)=>{

  const worker = new Worker(
   path.join(__dirname,"ytWorker.js"),
   { workerData:{ url,type } }
  )

  worker.on("message",(data)=>{

   if(data.progress && progress){
    progress(data.progress)
   }

   if(data.done){
    resolve(data)
    worker.terminate()
   }

  })

  worker.on("error",(err)=>{
   worker.terminate()
   reject(err)
  })

 })

}
