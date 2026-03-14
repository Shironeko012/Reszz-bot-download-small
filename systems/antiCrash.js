const logger = require("../utils/logger")

module.exports = () => {

 process.on("uncaughtException", e => logger.error(e))
 process.on("unhandledRejection", e => logger.error(e))

}
