// // usersRoute.test.js

// const request = require("supertest")
// const express = require("express")
// const { expect } = require("chai")
// const proxyquire = require("proxyquire").noCallThru()
// const { db } = require("../db") // Sequelize instance

// const User = require("../db/models/User.js") // Import User model directly

// describe("Users Route", () => {
//   let app

//   before(async () => {
//     await db.sync({ force: true })
//   })

//   beforeEach(async () => {
//     app = express()
//     app.use(express.json())

//     const usersRouter = proxyquire("./users", {
//       "../auth/authenticateToken": (req, res, next) => {
//         req.user = { id: 1, username: "testuser" }
//         next()
//       },
//     })

//     app.use("/users", usersRouter)

//     await User.bulkCreate([
//       { username: "user1", password: "pass1", email: "user1@example.com" },
//       { username: "user2", password: "pass2", email: "user2@example.com" },
//     ])
//   })

//   afterEach(async () => {
//     await User.destroy({ where: {} })
//   })

//   after(async () => {
//     await db.close()
//   })

//   describe("GET /users", () => {
//     it("should return a list of users when authenticated", async () => {
//       const res = await request(app)
//         .get("/users")
//         .set("Authorization", "Bearer fake-token")

//       expect(res.status).to.equal(200)
//       expect(res.body).to.be.an("array").with.lengthOf(2)
//       res.body.forEach((user) => {
//         expect(user).to.have.property("id")
//         expect(user).to.have.property("username")
//         expect(user).to.not.have.property("password")
//         expect(user).to.not.have.property("email")
//       })
//     })

//     it("should return 401 when not authenticated", async () => {
//       app = express()
//       app.use(express.json())

//       const usersRouter = proxyquire("./users", {
//         "../auth/authenticateToken": (req, res, next) => {
//           res.status(401).json({ error: "Authentication required" })
//         },
//       })

//       app.use("/users", usersRouter)

//       const res = await request(app).get("/users")

//       expect(res.status).to.equal(401)
//       expect(res.body).to.have.property("error", "Authentication required")
//     })
//   })
// })
