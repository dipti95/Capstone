const express = require("express")
const chai = require("chai")
const sinon = require("sinon")
const supertest = require("supertest")
const proxyquire = require("proxyquire")

const {
  models: { User },
} = require("../db") // Correct import for User

const { expect } = chai

// Mock `authenticateToken` middleware
const authenticateTokenStub = (req, res, next) => next()

// Use `proxyquire` to override `authenticateToken` in the router
const usersRouter = proxyquire("./users", {
  "../auth/authenticateToken": authenticateTokenStub,
})

const app = express()
app.use(express.json())
app.use("/api/users", usersRouter)

// Add error-handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message })
})

describe("GET /api/users", () => {
  afterEach(() => {
    sinon.restore() // Restore all stubs
  })

  it("should return a list of users", async () => {
    // Mock the User model's findAll method
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
    // Mock the User model's findAll method to throw an error
    sinon.stub(User, "findAll").rejects(new Error("Database error"))

    const response = await supertest(app).get("/api/users")

    expect(response.status).to.equal(500)
    expect(response.body).to.have.property("error", "Database error")
  })
})
