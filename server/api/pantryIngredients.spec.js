const express = require("express")
const chai = require("chai")
const supertest = require("supertest")
const { expect } = chai
const sinon = require("sinon")
const proxyquire = require("proxyquire")

const { models } = require("../db")
const { PantryIngredient, Ingredient } = models

const authenticateTokenMock = (req, res, next) => {
  req.user = { id: 1, username: "testuser" }
  next()
}

const pantryIngredientsRouter = proxyquire("./pantryIngredients", {
  "../auth/authenticateToken": authenticateTokenMock,
})

const app = express()
app.use(express.json())
app.use("/api/pantryIngredients", pantryIngredientsRouter)

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message })
})

describe("PantryIngredients API Endpoints", () => {
  afterEach(() => {
    sinon.restore()
  })

  describe("GET /api/pantryIngredients", () => {
    it("should return a list of pantry ingredients for the given pantryId", async () => {
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
      sinon.stub(PantryIngredient, "findAll").resolves([])

      const response = await supertest(app)
        .get("/api/pantryIngredients")
        .query({ pantryId: 999 })
        .expect(200)

      expect(response.body).to.be.an("array").that.is.empty
    })

    it("should handle database errors gracefully", async () => {
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

  describe("POST /api/pantryIngredients", () => {
    it("should create a new pantry ingredient when pantryQty is provided", async () => {
      const newPantryIngredient = {
        pantryQty: 10,
      }

      const createdPantryIngredient = {
        id: 3,
        pantryQty: 10,
      }

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
      const newPantryIngredient = {
        pantryQty: 10,
      }

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

  describe("PUT /api/pantryIngredients/:id", () => {
    it("should update the pantryQty of the specified pantry ingredient", async () => {
      const updateData = {
        pantryQty: 15,
      }

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

      expect(
        existingPantryIngredient.update.calledOnceWithExactly({ pantryQty: 15 })
      ).to.be.true
    })

    it("should return 404 if pantryQty is not provided in the request body", async () => {
      const existingPantryIngredient = {
        id: 1,
        pantryId: 1,
        pantryQty: 5,
        update: sinon.stub(),
      }

      sinon
        .stub(PantryIngredient, "findByPk")
        .resolves(existingPantryIngredient)

      const updateData = {}

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
