const config = require("../config")

const users = new Map()

module.exports = (id) => {

 const now = Date.now()

 if (!users.has(id)) users.set(id, [])

 const timestamps = users.get(id).filter(t => now - t < 60000)

 if (timestamps.length >= config.rateLimit) return false

 timestamps.push(now)

 users.set(id, timestamps)

 return true

}
