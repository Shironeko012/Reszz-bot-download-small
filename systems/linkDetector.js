module.exports = function(url){

    if(url.includes("youtube")) return "youtube"
    if(url.includes("tiktok")) return "tiktok"
    if(url.includes("instagram")) return "instagram"

    return "generic"

}
