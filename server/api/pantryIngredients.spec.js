// test/pantryIngredients.spec.js

const express = require("express")
const chai = require("chai")
const supertest = require("supertest")
const { expect } = chai
const sinon = require("sinon")
const proxyquire = require("proxyquire")

// Import the Sequelize models from db/index.js
const { models } = require("../db")
const { PantryIngredient, Ingredient } = models

// Create a mock for authenticateToken middleware
const authenticateTokenMock = (req, res, next) => {
  req.user = { id: 1, username: "testuser" }
  next()
}

// Use proxyquire to replace the actual authenticateToken middleware with the mock
const pantryIngredientsRouter = proxyquire("./pantryIngredients", {
  "../auth/authenticateToken": authenticateTokenMock,
})

// Initialize Express App for Testing
const app = express()
app.use(express.json())
app.use("/api/pantryIngredients", pantryIngredientsRouter)

// Add error-handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message })
})

// Begin Test Suite
describe("PantryIngredients API Endpoints", () => {
  afterEach(() => {
    sinon.restore() // Restore any stubs or mocks created by sinon
  })

  /**
   * Test GET /api/pantryIngredients?pantryId=1
   * Description: Retrieve all pantry ingredients for a specific pantry
   */
  describe("GET /api/pantryIngredients", () => {
    it("should return a list of pantry ingredients for the given pantryId", async () => {
      // Mock data
      const mockPantryIngredients = [
        {
          id: 1,
          pantryId: 1,
          pantryQty: 5,
          Ingredient: { id: 301, name: "Sugar" },
        },
        {
          id: 2,
          pantryId: 1,
          pantryQty: 2,
          Ingredient: { id: 302, name: "Salt" },
        },
      ]

      // Stub PantryIngredient.findAll to return mockPantryIngredients
      sinon.stub(PantryIngredient, "findAll").resolves(mockPantryIngredients)

      const response = await supertest(app)
        .get("/api/pantryIngredients")
        .query({ pantryId: 1 })
        .expect(200)

      expect(response.body).to.be.an("array").that.has.lengthOf(2)
      response.body.forEach((item) => {
        expect(item).to.include.keys(
          "id",
          "pantryId",
          "pantryQty",
          "Ingredient"
        )
        expect(item.pantryId).to.equal(1)
        expect(item.pantryQty).to.be.a("number")
        expect(item.Ingredient).to.include.keys("id", "name")
      })
    })

    it("should return an empty array if no pantry ingredients are found", async () => {
      // Stub PantryIngredient.findAll to return an empty array
      sinon.stub(PantryIngredient, "findAll").resolves([])

      const response = await supertest(app)
        .get("/api/pantryIngredients")
        .query({ pantryId: 999 }) // Assume pantryId 999 does not exist
        .expect(200)

      expect(response.body).to.be.an("array").that.is.empty
    })

    it("should handle database errors gracefully", async () => {
      // Stub PantryIngredient.findAll to throw an error
      sinon
        .stub(PantryIngredient, "findAll")
        .throws(new Error("Database failure"))

      const response = await supertest(app)
        .get("/api/pantryIngredients")
        .query({ pantryId: 1 })
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })

  /**
   * Test POST /api/pantryIngredients
   * Description: Create a new pantry ingredient
   */
  describe("POST /api/pantryIngredients", () => {
    it("should create a new pantry ingredient when pantryQty is provided", async () => {
      // Mock request body
      const newPantryIngredient = {
        pantryQty: 10,
      }

      // Mock created PantryIngredient
      const createdPantryIngredient = {
        id: 3,
        pantryQty: 10,
      }

      // Stub PantryIngredient.create to return createdPantryIngredient
      sinon.stub(PantryIngredient, "create").resolves(createdPantryIngredient)

      const response = await supertest(app)
        .post("/api/pantryIngredients")
        .send(newPantryIngredient)
        .expect(200)

      expect(response.body).to.include({
        id: 3,
        pantryQty: 10,
      })
    })

    it("should return 404 if pantryQty is not provided in the request body", async () => {
      // Mock request body without pantryQty
      const invalidPantryIngredient = {}

      const response = await supertest(app)
        .post("/api/pantryIngredients")
        .send(invalidPantryIngredient)
        .expect(404)

      expect(response.body).to.have.property(
        "error",
        "No 'pantryQty' on req.body."
      )
    })

    it("should handle database errors gracefully", async () => {
      // Mock request body
      const newPantryIngredient = {
        pantryQty: 10,
      }

      // Stub PantryIngredient.create to throw an error
      sinon
        .stub(PantryIngredient, "create")
        .throws(new Error("Database failure"))

      const response = await supertest(app)
        .post("/api/pantryIngredients")
        .send(newPantryIngredient)
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })

  /**
   * Test PUT /api/pantryIngredients/:id
   * Description: Update a pantry ingredient's quantity by ID
   */
  describe("PUT /api/pantryIngredients/:id", () => {
    it("should update the pantryQty of the specified pantry ingredient", async () => {
      // Mock request body
      const updateData = {
        pantryQty: 15,
      }

      // Mock existing PantryIngredient
      const existingPantryIngredient = {
        id: 1,
        pantryId: 1,
        pantryQty: 5,
        update: sinon.stub().resolves({
          id: 1,
          pantryId: 1,
          pantryQty: 15,
        }),
      }

      // Stub PantryIngredient.findByPk to return existingPantryIngredient
      sinon
        .stub(PantryIngredient, "findByPk")
        .resolves(existingPantryIngredient)

      const response = await supertest(app)
        .put("/api/pantryIngredients/1")
        .send(updateData)
        .expect(200)

      expect(response.body).to.include({
        id: 1,
        pantryId: 1,
        pantryQty: 15,
      })

      // Verify that update was called with correct data
      expect(
        existingPantryIngredient.update.calledOnceWithExactly({ pantryQty: 15 })
      ).to.be.true
    })

    it("should return 404 if pantryQty is not provided in the request body", async () => {
      // Mock existing PantryIngredient
      const existingPantryIngredient = {
        id: 1,
        pantryId: 1,
        pantryQty: 5,
        update: sinon.stub(),
      }

      // Stub PantryIngredient.findByPk to return existingPantryIngredient
      sinon
        .stub(PantryIngredient, "findByPk")
        .resolves(existingPantryIngredient)

      const updateData = {} // Missing pantryQty

      const response = await supertest(app)
        .put("/api/pantryIngredients/1")
        .send(updateData)
        .expect(404)

      expect(response.body).to.have.property(
        "error",
        "No 'pantryQty' on req.body."
      )
    })

    it("should handle database errors gracefully", async () => {
      // Stub PantryIngredient.findByPk to throw an error
      sinon
        .stub(PantryIngredient, "findByPk")
        .throws(new Error("Database failure"))

      const updateData = {
        pantryQty: 15,
      }

      const response = await supertest(app)
        .put("/api/pantryIngredients/1")
        .send(updateData)
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })
})
