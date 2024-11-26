const express = require("express")
const chai = require("chai")
const supertest = require("supertest")
const { expect } = chai
const sinon = require("sinon")
const proxyquire = require("proxyquire")

const { models } = require("../db")
const { Pantry, Ingredient, User } = models

const authenticateTokenMock = (req, res, next) => {
  req.user = { id: 1, username: "testuser" }
  next()
}

const pantriesRouter = proxyquire("./pantries", {
  "../auth/authenticateToken": authenticateTokenMock,
})

const app = express()
app.use(express.json())
app.use("/api/pantries", pantriesRouter)

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message })
})

describe("Pantries API Endpoints", () => {
  afterEach(() => {
    sinon.restore()
  })

  describe("GET /api/pantries", () => {
    it("should return a list of pantries for the given userId", async () => {
      const mockPantries = [
        {
          id: 1,
          name: "Main Pantry",
          userId: 1,
          Ingredients: [
            { id: 101, name: "Tomatoes" },
            { id: 102, name: "Onions" },
          ],
        },
        {
          id: 2,
          name: "Secondary Pantry",
          userId: 1,
          Ingredients: [{ id: 103, name: "Garlic" }],
        },
      ]

      sinon.stub(Pantry, "findAll").resolves(mockPantries)

      const response = await supertest(app)
        .get("/api/pantries")
        .query({ userId: 1 })
        .expect(200)

      expect(response.body).to.be.an("array").that.has.lengthOf(2)
      response.body.forEach((pantry) => {
        expect(pantry).to.include.keys("id", "name", "userId", "Ingredients")
        expect(pantry.userId).to.equal(1)
        expect(pantry.Ingredients).to.be.an("array").with.length.greaterThan(0)
        pantry.Ingredients.forEach((ingredient) => {
          expect(ingredient).to.include.keys("id", "name")
        })
      })
    })

    it("should return 200 with an empty array if no pantries are found for the userId", async () => {
      sinon.stub(Pantry, "findAll").resolves([])

      const response = await supertest(app)
        .get("/api/pantries")
        .query({ userId: 999 })
        .expect(200)

      expect(response.body).to.be.an("array").that.is.empty
    })

    it("should handle database errors gracefully", async () => {
      sinon.stub(Pantry, "findAll").throws(new Error("Database failure"))

      const response = await supertest(app)
        .get("/api/pantries")
        .query({ userId: 1 })
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })

  describe("GET /api/pantries/:pantryId", () => {
    it("should return the pantry with the given pantryId", async () => {
      const mockPantry = {
        id: 1,
        name: "Main Pantry",
        userId: 1,
        Ingredients: [
          { id: 101, name: "Tomatoes" },
          { id: 102, name: "Onions" },
        ],
      }

      sinon.stub(Pantry, "findByPk").resolves(mockPantry)

      const response = await supertest(app).get("/api/pantries/1").expect(200)

      expect(response.body).to.be.an("object")
      expect(response.body).to.include({
        id: 1,
        name: "Main Pantry",
        userId: 1,
      })
      expect(response.body.Ingredients).to.be.an("array").with.lengthOf(2)
      response.body.Ingredients.forEach((ingredient) => {
        expect(ingredient).to.include.keys("id", "name")
      })
    })

    it("should return 404 if the pantry is not found", async () => {
      sinon.stub(Pantry, "findByPk").resolves(null)

      const response = await supertest(app).get("/api/pantries/999").expect(404)

      expect(response.body).to.have.property(
        "error",
        "No pantries found for this userId"
      )
    })

    it("should handle database errors gracefully", async () => {
      sinon.stub(Pantry, "findByPk").throws(new Error("Database failure"))

      const response = await supertest(app).get("/api/pantries/1").expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })
})
