const express = require("express")
const chai = require("chai")
const supertest = require("supertest")
const { expect } = chai
const sinon = require("sinon")
const proxyquire = require("proxyquire")

const { models } = require("../db")
const { Ingredient, Pantry, ShoppingList, Recipe } = models

const authenticateTokenMock = (req, res, next) => {
  req.user = { id: 1, username: "testuser" }
  next()
}

const ingredientsRouter = proxyquire("./ingredients", {
  "../auth/authenticateToken": authenticateTokenMock,
})

const app = express()
app.use(express.json())
app.use("/api/ingredients", ingredientsRouter)

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message })
})

// Begin Test Suite
describe("Ingredients API Endpoints", () => {
  afterEach(() => {
    sinon.restore()
  })

  describe("GET /api/ingredients/all", () => {
    it("should return a list of all ingredients", async () => {
      // Mock data
      const mockIngredients = [
        { id: 1, name: "Tomatoes" },
        { id: 2, name: "Onions" },
        { id: 3, name: "Garlic" },
      ]

      // Stub Ingredient.findAll to return mockIngredients
      sinon.stub(Ingredient, "findAll").resolves(mockIngredients)

      const response = await supertest(app)
        .get("/api/ingredients/all")
        .expect(200)

      expect(response.body).to.be.an("array").that.has.lengthOf(3)
      response.body.forEach((ingredient) => {
        expect(ingredient).to.include.keys("id", "name")
      })
    })

    it("should handle database errors gracefully", async () => {
      // Stub Ingredient.findAll to throw an error
      sinon.stub(Ingredient, "findAll").throws(new Error("Database failure"))

      const response = await supertest(app)
        .get("/api/ingredients/all")
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })

  /**
   * Test GET /api/ingredients?userId=1
   * Description: Retrieve all unique ingredients associated with a user's pantries, shopping lists, and recipes
   */
  describe("GET /api/ingredients", () => {
    it("should return an empty array if the user has no associated ingredients", async () => {
      // Stub Pantry.findAll, ShoppingList.findAll, Recipe.findAll to return empty arrays
      sinon.stub(Pantry, "findAll").resolves([])
      sinon.stub(ShoppingList, "findAll").resolves([])
      sinon.stub(Recipe, "findAll").resolves([])

      const response = await supertest(app)
        .get("/api/ingredients")
        .query({ userId: 999 }) // Assume userId 999 has no data
        .expect(200)

      expect(response.body).to.be.an("array").that.is.empty
    })

    it("should handle database errors gracefully", async () => {
      // Stub Pantry.findAll to throw an error
      sinon.stub(Pantry, "findAll").throws(new Error("Database failure"))

      const response = await supertest(app)
        .get("/api/ingredients")
        .query({ userId: 1 })
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })

  /**
   * Test GET /api/ingredients/pantries?userId=1
   * Description: Retrieve all ingredients associated with a user's pantries
   */
  describe("GET /api/ingredients/pantries", () => {
    it("should return an empty array if the user has no pantries", async () => {
      // Stub Pantry.findAll to return empty array
      sinon.stub(Pantry, "findAll").resolves([])

      const response = await supertest(app)
        .get("/api/ingredients/pantries")
        .query({ userId: 999 }) // Assume userId 999 has no pantries
        .expect(200)

      expect(response.body).to.be.an("array").that.is.empty
    })

    it("should handle database errors gracefully", async () => {
      // Stub Pantry.findAll to throw an error
      sinon.stub(Pantry, "findAll").throws(new Error("Database failure"))

      const response = await supertest(app)
        .get("/api/ingredients/pantries")
        .query({ userId: 1 })
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })

  /**
   * Test POST /api/ingredients?userId=1
   * Description: Create a new ingredient or update an existing one based on name
   */
  describe("POST /api/ingredients", () => {
    it("should create a new ingredient if it does not exist", async () => {
      // Mock request body
      const newIngredientData = {
        name: "Broccoli",
        nutritionalInfo: {
          calories: 55,
          protein: 3.7,
          carbs: 11.1,
          fat: 0.6,
        },
      }

      // Stub Ingredient.findOne to return null (ingredient does not exist)
      sinon.stub(Ingredient, "findOne").resolves(null)

      // Stub Ingredient.create to return the newly created ingredient
      const createdIngredient = {
        id: 4,
        name: "Broccoli",
        nutritionalInfo: {
          calories: 55,
          protein: 3.7,
          carbs: 11.1,
          fat: 0.6,
        },
      }
      sinon.stub(Ingredient, "create").resolves(createdIngredient)

      const response = await supertest(app)
        .post("/api/ingredients")
        .query({ userId: 1 }) // Assuming userId is part of query
        .send(newIngredientData)
        .expect(200)

      expect(response.body).to.include({
        id: 4,
        name: "Broccoli",
      })
      expect(response.body.nutritionalInfo).to.deep.equal({
        calories: 55,
        protein: 3.7,
        carbs: 11.1,
        fat: 0.6,
      })

      // Verify that findOne was called with correct parameters
      expect(
        Ingredient.findOne.calledOnceWithExactly({
          where: { name: "Broccoli" },
        })
      ).to.be.true

      // Verify that create was called with correct data
      expect(Ingredient.create.calledOnceWithExactly(newIngredientData)).to.be
        .true
    })

    it("should handle database errors gracefully", async () => {
      // Mock request body
      const newIngredientData = {
        name: "Broccoli",
        nutritionalInfo: {
          calories: 55,
          protein: 3.7,
          carbs: 11.1,
          fat: 0.6,
        },
      }

      // Stub Ingredient.findOne to throw an error
      sinon.stub(Ingredient, "findOne").throws(new Error("Database failure"))

      const response = await supertest(app)
        .post("/api/ingredients")
        .query({ userId: 1 })
        .send(newIngredientData)
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })

    it("should handle missing ingredient data gracefully", async () => {
      // Stub Ingredient.findOne and Ingredient.create are not needed as request body is missing

      // Mock request body without name
      const invalidData = {
        nutritionalInfo: {
          calories: 55,
          protein: 3.7,
          carbs: 11.1,
          fat: 0.6,
        },
      }

      const response = await supertest(app)
        .post("/api/ingredients")
        .query({ userId: 1 })
        .send(invalidData)
        .expect(500) // Assuming server throws an error due to missing 'name'

      expect(response.body).to.have.property("error")
      // Depending on server implementation, adjust the expected error message
    })
  })
})
