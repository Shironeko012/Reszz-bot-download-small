const https = require("https")

function resolve(url){

 return new Promise((resolveUrl)=>{

  try{

   const req = https.request(url,{method:"GET"},(res)=>{

    if(res.headers.location){
     resolveUrl(res.headers.location)
    }else{
     resolveUrl(url)
    }

   })

   req.on("error",()=>resolveUrl(url))
   req.end()

  }catch{

   resolveUrl(url)

  }

 })

}

async function convert(url){

 url = await resolve(url)

 if(url.includes("x.com")){
  url = url.replace("x.com","twitter.com")
 }

 if(url.includes("vm.tiktok.com") || url.includes("vt.tiktok.com")){
  url = await resolve(url)
 }

 return url

}

module.exports = { convert }
