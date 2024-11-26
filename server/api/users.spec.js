const express = require("express")
const chai = require("chai")
const sinon = require("sinon")
const supertest = require("supertest")
const proxyquire = require("proxyquire")

const {
  models: { User },
} = require("../db")

const { expect } = chai

const authenticateTokenStub = (req, res, next) => next()

const usersRouter = proxyquire("./users", {
  "../auth/authenticateToken": authenticateTokenStub,
})

const app = express()
app.use(express.json())
app.use("/api/users", usersRouter)

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message })
})

describe("GET /api/users", () => {
  afterEach(() => {
    sinon.restore()
  })

  it("should return a list of users", async () => {
    const mockUsers = [
      { id: 1, username: "user1" },
      { id: 2, username: "user2" },
    ]
    sinon.stub(User, "findAll").resolves(mockUsers)

    const response = await supertest(app).get("/api/users")

    expect(response.status).to.equal(200)
    expect(response.body).to.deep.equal(mockUsers)
    expect(User.findAll.calledOnce).to.be.true
  })

  it("should handle errors gracefully", async () => {
    sinon.stub(User, "findAll").rejects(new Error("Database error"))

    const response = await supertest(app).get("/api/users")

    expect(response.status).to.equal(500)
    expect(response.body).to.have.property("error", "Database error")
  })
})
