const router = require("express").Router()
module.exports = router

console.log("API----------------STEP1")

router.use("/users", require("./users"))

router.use((req, res, next) => {
  const error = new Error("Not Found")
  error.status = 404
  next(error)
})
