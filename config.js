require("dotenv").config()

module.exports = {

 prefix: process.env.PREFIX || ".",

 owner: process.env.OWNER || "",

 maxFileSizeMB: Number(process.env.MAX_FILE_SIZE_MB) || 50,

 rateLimit: Number(process.env.RATE_LIMIT) || 10,

 downloadTimeout: 600000,

 tempDir: "./temp"

}
