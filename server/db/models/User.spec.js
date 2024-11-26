const { expect } = require("chai")
const sinon = require("sinon")
const proxyquire = require("proxyquire")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

let User
let testUser
let sendMailStub

describe("User Model", () => {
  before(async () => {
    const db = require("../db")
    await db.sync({ force: true })
  })

  after(async () => {
    const db = require("../db")
    await db.close()
  })

  beforeEach(async () => {
    sendMailStub = sinon.stub().resolves()

    User = proxyquire("./user", {
      nodemailer: {
        createTransport: () => ({
          sendMail: sendMailStub,
        }),
      },
    })

    testUser = await User.create({
      username: "testuser",
      password: "password123",
      email: "testuser@example.com",
    })
  })

  afterEach(async () => {
    await User.destroy({ where: {} })
    sinon.restore()
  })

  describe("User Creation and Validation", () => {
    it("should create a user with valid attributes", async () => {
      const newUser = await User.create({
        username: "newuser",
        password: "newpassword",
        email: "newuser@example.com",
      })

      expect(newUser.username).to.equal("newuser")
      expect(newUser.email).to.equal("newuser@example.com")
    })

    it("should not create a user with an invalid email", async () => {
      try {
        await User.create({
          username: "invalidemailuser",
          password: "password",
          email: "invalidemail",
        })
        throw new Error("User creation should have failed")
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          "Validation isEmail on email failed"
        )
      }
    })

    it("should not create a user with a duplicate username", async () => {
      try {
        await User.create({
          username: "testuser",
          password: "password",
          email: "duplicate@example.com",
        })
        throw new Error("User creation should have failed")
      } catch (error) {
        expect(error.name).to.equal("SequelizeUniqueConstraintError")
      }
    })

    it("should require a username and password", async () => {
      try {
        await User.create({
          email: "nousername@example.com",
        })
        throw new Error("User creation should have failed")
      } catch (error) {
        expect(error.errors.some((e) => e.path === "username")).to.be.true
      }
    })
  })

  describe("Password Hashing and Verification", () => {
    it("should hash the password before saving", async () => {
      expect(testUser.password).to.not.equal("password123")
      const isMatch = await bcrypt.compare("password123", testUser.password)
      expect(isMatch).to.be.true
    })

    it("should hash the password when updated", async () => {
      const oldHashedPassword = testUser.password
      await testUser.update({ password: "newpassword" })
      expect(testUser.password).to.not.equal(oldHashedPassword)
      const isMatch = await bcrypt.compare("newpassword", testUser.password)
      expect(isMatch).to.be.true
    })

    it("should validate the correct password using correctPassword method", async () => {
      const isValid = await testUser.correctPassword("password123")
      expect(isValid).to.be.true
    })

    it("should invalidate an incorrect password using correctPassword method", async () => {
      const isValid = await testUser.correctPassword("wrongpassword")
      expect(isValid).to.be.false
    })
  })

  describe("Token Generation and Verification", () => {
    it("should generate a JWT token containing the user id", () => {
      const token = testUser.generateToken()
      const decoded = jwt.verify(token, process.env.JWT)
      expect(decoded.id).to.equal(testUser.id)
    })

    it("should find a user by valid token", async () => {
      const token = testUser.generateToken()
      const user = await User.findByToken(token)
      expect(user.id).to.equal(testUser.id)
    })

    it("should throw an error with an invalid token", async () => {
      try {
        await User.findByToken("invalidtoken")
        throw new Error("findByToken should have failed")
      } catch (error) {
        expect(error.message).to.equal("bad token")
        expect(error.status).to.equal(401)
      }
    })
  })

  describe("Authentication (OTP Generation and Email Sending)", () => {
    it("should authenticate with correct credentials and send OTP", async () => {
      const response = await User.authenticate({
        username: "testuser",
        password: "password123",
      })

      expect(response.message).to.equal("OTP sent to your email")
      expect(response.userId).to.equal(testUser.id)

      expect(sendMailStub.calledOnce).to.be.true

      const user = await User.findByPk(testUser.id)
      expect(user.otp).to.be.a("string").with.lengthOf(6)
      expect(user.otpExpiration).to.be.an.instanceof(Date)
    })

    it("should not authenticate with incorrect password", async () => {
      try {
        await User.authenticate({
          username: "testuser",
          password: "wrongpassword",
        })
        throw new Error("Authentication should have failed")
      } catch (error) {
        expect(error.message).to.equal("Incorrect username/password")
        expect(error.status).to.equal(401)
      }
    })

    it("should not authenticate a non-existent user", async () => {
      try {
        await User.authenticate({
          username: "nonexistent",
          password: "password",
        })
        throw new Error("Authentication should have failed")
      } catch (error) {
        expect(error.message).to.equal("Incorrect username/password")
        expect(error.status).to.equal(401)
      }
    })
  })

  describe("OTP Verification", () => {
    let otp

    beforeEach(async () => {
      await User.authenticate({
        username: "testuser",
        password: "password123",
      })
      const user = await User.findByPk(testUser.id)
      otp = user.otp
    })

    it("should verify the correct OTP and return a token", async () => {
      const token = await User.verifyOTP({
        username: "testuser",
        otp,
      })

      const decoded = jwt.verify(token, process.env.JWT)
      expect(decoded.id).to.equal(testUser.id)

      // Ensure OTP and expiration are cleared
      const user = await User.findByPk(testUser.id)
      expect(user.otp).to.be.null
      expect(user.otpExpiration).to.be.null
    })

    it("should not verify an incorrect OTP", async () => {
      try {
        await User.verifyOTP({
          username: "testuser",
          otp: "000000",
        })
        throw new Error("OTP verification should have failed")
      } catch (error) {
        expect(error.message).to.equal("Invalid or expired OTP")
        expect(error.status).to.equal(401)
      }
    })

    it("should not verify an expired OTP", async () => {
      await testUser.update({ otpExpiration: new Date(Date.now() - 600000) })

      try {
        await User.verifyOTP({
          username: "testuser",
          otp,
        })
        throw new Error("OTP verification should have failed")
      } catch (error) {
        expect(error.message).to.equal("Invalid or expired OTP")
        expect(error.status).to.equal(401)
      }
    })

    it("should not verify OTP for non-existent user", async () => {
      try {
        await User.verifyOTP({
          username: "nonexistent",
          otp,
        })
        throw new Error("OTP verification should have failed")
      } catch (error) {
        expect(error.message).to.equal("User not found")
        expect(error.status).to.equal(404)
      }
    })
  })

  describe("Edge Cases and Error Handling", () => {
    it("should handle errors during OTP email sending", async () => {
      sendMailStub.rejects(new Error("Email service error"))

      try {
        await User.authenticate({
          username: "testuser",
          password: "password123",
        })
        throw new Error("Authentication should have failed")
      } catch (error) {
        expect(error.message).to.equal("Email service error")
      }
    })
  })
})
