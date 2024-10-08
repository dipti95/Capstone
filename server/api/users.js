const router = require("express").Router()
const {
  models: { User },
} = require("../db")
module.exports = router
const authenticateToken = require("../auth/authenticateToken")

router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username"],
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})
