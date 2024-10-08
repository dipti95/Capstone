const router = require("express").Router()

const {
  models: { User },
} = require("../db")
module.exports = router

console.log("AUTH----------------STEP1")

router.post("/login", async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body) })
  } catch (err) {
    next(err)
  }
})

console.log("AUTH----------------STEP2")

router.post("/signup", async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.send({ token: await user.generateToken() })
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists")
    } else {
      next(err)
    }
  }
})

console.log("AUTH----------------STEP3")

router.get("/me", async (req, res, next) => {
  try {
    res.send(await User.findByToken(req.headers.authorization))
  } catch (ex) {
    next(ex)
  }
})

router.put("/me", async (req, res, next) => {
  try {
    const user = await User.findByToken(req.body.headers.authorization)
    const newUser = await user.update(req.body.newAccount)
    res.send(newUser)
  } catch (error) {
    next(error)
  }
})

console.log("AUTH----------------LAST")
