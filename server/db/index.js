//this is the access point for all things database related!

const db = require("./db")

const User = require("./models/User")

module.exports = {
  db,
  models: {
    User,
  },
}
