const config = require("../config")

module.exports = (size) => {

 return size <= config.maxSizeMB * 1024 * 1024

}
