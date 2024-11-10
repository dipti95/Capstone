const router = require("express").Router()
const Pantry = require("../db/models/Pantry")
const ShoppingList = require("../db/models/ShoppingList")

const {
  models: { User },
} = require("../db")
module.exports = router

router.post("/login", async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body) })
  } catch (err) {
    next(err)
  }
})

router.post("/otp", async (req, res, next) => {
  try {
    res.send({ token: await User.verifyOTP(req.body) })
  } catch (err) {
    next(err)
  }
})

router.post("/signup", async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    const defaultPantry = await Pantry.create({ name: "Home" })
    await defaultPantry.setUser(user)
    const defaultList = await ShoppingList.create({
      name: "My Shopping List",
      status: "open",
    })
    await defaultList.setUser(user)
    res.send({ token: await user.generateToken() })
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists")
    } else {
      next(err)
    }
  }
})

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

router.put("/forgot-password", async (req, res, next) => {
  try {
    const { username, newPassword } = req.body

    const user = await User.findOne({ where: { username } })

    if (!user) {
      return res.status(404).send("User not found")
    }

    user.password = newPassword
    await user.save()

    res.send({ message: "Password has been reset successfully." })
  } catch (error) {
    next(error)
  }
})
