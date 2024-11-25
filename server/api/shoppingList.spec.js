const express = require("express")
const chai = require("chai")
const supertest = require("supertest")
const { expect } = chai
const sinon = require("sinon")
const proxyquire = require("proxyquire")

const { models } = require("../db")
const { ShoppingList, Ingredient } = models

const authenticateTokenMock = (req, res, next) => {
  req.user = { id: 1, username: "testuser" }
  next()
}

const shoppingListRouter = proxyquire("./shoppingList", {
  "../auth/authenticateToken": authenticateTokenMock,
})

const app = express()
app.use(express.json())
app.use("/api/shoppingList", shoppingListRouter)

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message })
})

describe("ShoppingList API Endpoints", () => {
  afterEach(() => {
    sinon.restore()
  })

  describe("GET /api/shoppingList/all", () => {
    it("should return a list of closed shopping lists for the user", async () => {
      const mockShoppingLists = [
        {
          id: 1,
          userId: 1,
          status: "closed",
          name: "Closed List 1",
          Ingredients: [{ id: 101, name: "Tomatoes" }],
        },
        {
          id: 2,
          userId: 1,
          status: "closed",
          name: "Closed List 2",
          Ingredients: [{ id: 102, name: "Onions" }],
        },
      ]

      sinon.stub(ShoppingList, "findAll").resolves(mockShoppingLists)

      const response = await supertest(app)
        .get("/api/shoppingList/all")
        .query({ userId: 1 })
        .expect(200)

      expect(response.body).to.be.an("array").that.has.lengthOf(2)
      response.body.forEach((list) => {
        expect(list).to.include.keys(
          "id",
          "userId",
          "status",
          "name",
          "Ingredients"
        )
        expect(list.status).to.equal("closed")
        expect(list.userId).to.equal(1)
        expect(list.Ingredients).to.be.an("array").with.length.greaterThan(0)
        list.Ingredients.forEach((ingredient) => {
          expect(ingredient).to.include.keys("id", "name")
        })
      })
    })

    it("should return 200 with an empty array if no shopping lists are found", async () => {
      sinon.stub(ShoppingList, "findAll").resolves([])

      const response = await supertest(app)
        .get("/api/shoppingList/all")
        .query({ userId: 999 })
        .expect(200)

      expect(response.body).to.be.an("array").that.is.empty
    })

    it("should handle database errors gracefully", async () => {
      sinon.stub(ShoppingList, "findAll").throws(new Error("Database failure"))

      const response = await supertest(app)
        .get("/api/shoppingList/all")
        .query({ userId: 1 })
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })

  describe("GET /api/shoppingList", () => {
    it("should return the open shopping list for the user", async () => {
      const mockShoppingList = {
        id: 3,
        userId: 1,
        status: "open",
        name: "Open List",
        Ingredients: [{ id: 103, name: "Garlic" }],
      }

      sinon.stub(ShoppingList, "findOne").resolves(mockShoppingList)

      const response = await supertest(app)
        .get("/api/shoppingList")
        .query({ userId: 1 })
        .expect(200)

      expect(response.body).to.be.an("object")
      expect(response.body).to.include({
        id: 3,
        userId: 1,
        status: "open",
        name: "Open List",
      })
      expect(response.body)
        .to.have.property("Ingredients")
        .that.is.an("array")
        .with.lengthOf(1)
      expect(response.body.Ingredients[0]).to.deep.include({
        id: 103,
        name: "Garlic",
      })
    })

    it("should return 404 if no open shopping list is found", async () => {
      sinon.stub(ShoppingList, "findOne").resolves(null)

      const response = await supertest(app)
        .get("/api/shoppingList")
        .query({ userId: 1 })
        .expect(404)

      expect(response.body).to.have.property(
        "error",
        "No shopping lists found for this userId"
      )
    })

    it("should handle database errors gracefully", async () => {
      sinon.stub(ShoppingList, "findOne").throws(new Error("Database failure"))

      const response = await supertest(app)
        .get("/api/shoppingList")
        .query({ userId: 1 })
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })

  describe("GET /api/shoppingList/:listId", () => {
    it("should return the shopping list with the given ID", async () => {
      const mockShoppingList = {
        id: 1,
        userId: 1,
        status: "closed",
        name: "Closed List 1",
        Ingredients: [{ id: 101, name: "Tomatoes" }],
      }

      sinon.stub(ShoppingList, "findByPk").resolves(mockShoppingList)

      const response = await supertest(app)
        .get("/api/shoppingList/1")
        .expect(200)

      expect(response.body).to.be.an("object")
      expect(response.body).to.include({
        id: 1,
        userId: 1,
        status: "closed",
        name: "Closed List 1",
      })
      expect(response.body)
        .to.have.property("Ingredients")
        .that.is.an("array")
        .with.lengthOf(1)
      expect(response.body.Ingredients[0]).to.deep.include({
        id: 101,
        name: "Tomatoes",
      })
    })

    it("should return 404 if the shopping list is not found", async () => {
      sinon.stub(ShoppingList, "findByPk").resolves(null)

      const response = await supertest(app)
        .get("/api/shoppingList/999")
        .expect(404)

      expect(response.body).to.have.property(
        "error",
        "No shopping lists found for this userId"
      )
    })

    it("should handle database errors gracefully", async () => {
      sinon.stub(ShoppingList, "findByPk").throws(new Error("Database failure"))

      const response = await supertest(app)
        .get("/api/shoppingList/1")
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })
})
