module.exports = (url)=>{

 try{

  new URL(url)

  if(url.startsWith("file:")) return false
  if(url.includes("localhost")) return false
  if(url.includes("127.0.0.1")) return false

  return true

 }catch{

  return false

 }

}
