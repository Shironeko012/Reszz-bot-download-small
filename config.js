require("dotenv").config()

module.exports = {
 prefix: process.env.PREFIX || ".",
 owner: process.env.OWNER || "",
 maxSizeMB: Number(process.env.MAX_SIZE_MB) || 50,
 rateLimit: Number(process.env.RATE_LIMIT) || 10,
 tempDir: "./temp",
}
