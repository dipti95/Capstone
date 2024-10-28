const router = require("express").Router()
module.exports = router

console.log("API----------------STEP1")

router.use("/users", require("./users"))
console.log("API----------------STEP2")
router.use("/pantries", require("./pantries"))
console.log("API----------------STEP3")
router.use("/ingredients", require("./ingredients"))
console.log("API----------------STEP4")
router.use("/shoppinglist", require("./shoppingList"))
console.log("API----------------STEP5")
router.use("/recipes", require("./recipes"))

console.log("API----------------STEP6")

router.use((req, res, next) => {
  const error = new Error("Not Found")
  error.status = 404
  next(error)
})
