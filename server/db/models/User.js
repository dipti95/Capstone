const Sequelize = require("sequelize")
const db = require("../db")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const nodemailer = require("nodemailer")

const SALT_ROUNDS = 5

const User = db.define("user", {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
    },
  },
  cuisinePref: {
    type: Sequelize.ENUM(
      "american",
      "asian",
      "british",
      "caribbean",
      "central europe",
      "chinese",
      "eastern europe",
      "french",
      "indian",
      "italian",
      "japanese",
      "kosher",
      "mediterranean",
      "mexican",
      "middle eastern",
      "nordic",
      "south american",
      "south east asian"
    ),
  },

  otp: {
    type: Sequelize.STRING,
  },
  otpExpiration: {
    type: Sequelize.DATE,
  },

  diet: {
    type: Sequelize.STRING,
    defaultValue: "",
  },

  health: {
    type: Sequelize.STRING,
    defaultValue: "",
  },
})

module.exports = User

const transporter = nodemailer.createTransport({
  host: "mail.gmx.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

User.prototype.correctPassword = function (candidatePwd) {
  return bcrypt.compare(candidatePwd, this.password)
}

User.prototype.generateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT)
}

User.findByToken = async function (token) {
  try {
    const { id } = await jwt.verify(token, process.env.JWT)
    const user = User.findByPk(id)
    if (!user) {
      throw "nooo"
    }
    return user
  } catch (ex) {
    const error = Error("bad token")
    error.status = 401
    throw error
  }
}

User.authenticate = async function ({ username, password }) {
  const user = await this.findOne({ where: { username } })
  if (!user || !(await user.correctPassword(password))) {
    const error = Error("Incorrect username/password")
    error.status = 401
    throw error
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  const otpExpiration = new Date(Date.now() + 5 * 60000)

  await user.update({ otp, otpExpiration })

  await sendOTPEmail(user.email, otp)

  return { message: "OTP sent to your email", userId: user.id }
}

User.verifyOTP = async function ({ otp, username }) {
  const user = await this.findOne({ where: { username } })

  if (!user) {
    const error = Error("User not found")
    error.status = 404
    throw error
  }

  if (user.otp !== otp || new Date() > user.otpExpiration) {
    const error = Error("Invalid or expired OTP")
    error.status = 401
    throw error
  }

  await user.update({ otp: null, otpExpiration: null })

  return user.generateToken()
}

async function sendOTPEmail(toEmail, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Food Buddy Security Code",
    text: `Your Food Buddy login security code is ${otp}. It will expire in 5 minutes.`,
  }

  await transporter.sendMail(mailOptions)
}

const hashPassword = async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
  }
}

User.beforeCreate(hashPassword)
User.beforeUpdate(hashPassword)
User.beforeBulkCreate((users) => Promise.all(users.map(hashPassword)))
