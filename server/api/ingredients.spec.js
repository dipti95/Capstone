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

describe("Ingredients API Endpoints", () => {
  afterEach(() => {
    sinon.restore()
  })

  describe("GET /api/ingredients/all", () => {
    it("should return a list of all ingredients", async () => {
      const mockIngredients = [
        { id: 1, name: "Tomatoes" },
        { id: 2, name: "Onions" },
        { id: 3, name: "Garlic" },
      ]

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
      sinon.stub(Ingredient, "findAll").throws(new Error("Database failure"))

      const response = await supertest(app)
        .get("/api/ingredients/all")
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })

  describe("GET /api/ingredients", () => {
    it("should return an empty array if the user has no associated ingredients", async () => {
      sinon.stub(Pantry, "findAll").resolves([])
      sinon.stub(ShoppingList, "findAll").resolves([])
      sinon.stub(Recipe, "findAll").resolves([])

      const response = await supertest(app)
        .get("/api/ingredients")
        .query({ userId: 999 })
        .expect(200)

      expect(response.body).to.be.an("array").that.is.empty
    })

    it("should handle database errors gracefully", async () => {
      sinon.stub(Pantry, "findAll").throws(new Error("Database failure"))

      const response = await supertest(app)
        .get("/api/ingredients")
        .query({ userId: 1 })
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })

  describe("GET /api/ingredients/pantries", () => {
    it("should return an empty array if the user has no pantries", async () => {
      sinon.stub(Pantry, "findAll").resolves([])

      const response = await supertest(app)
        .get("/api/ingredients/pantries")
        .query({ userId: 999 })
        .expect(200)

      expect(response.body).to.be.an("array").that.is.empty
    })

    it("should handle database errors gracefully", async () => {
      sinon.stub(Pantry, "findAll").throws(new Error("Database failure"))

      const response = await supertest(app)
        .get("/api/ingredients/pantries")
        .query({ userId: 1 })
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })

  describe("POST /api/ingredients", () => {
    it("should create a new ingredient if it does not exist", async () => {
      const newIngredientData = {
        name: "Broccoli",
        nutritionalInfo: {
          calories: 55,
          protein: 3.7,
          carbs: 11.1,
          fat: 0.6,
        },
      }

      sinon.stub(Ingredient, "findOne").resolves(null)

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
        .query({ userId: 1 })
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

      expect(
        Ingredient.findOne.calledOnceWithExactly({
          where: { name: "Broccoli" },
        })
      ).to.be.true

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

      sinon.stub(Ingredient, "findOne").throws(new Error("Database failure"))

      const response = await supertest(app)
        .post("/api/ingredients")
        .query({ userId: 1 })
        .send(newIngredientData)
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })

    it("should handle missing ingredient data gracefully", async () => {
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
        .expect(500)

      expect(response.body).to.have.property("error")
    })
  })
})
