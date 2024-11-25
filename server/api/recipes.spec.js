// test/recipes.spec.js

const express = require("express")
const chai = require("chai")
const supertest = require("supertest")
const { expect } = chai
const sinon = require("sinon")
const proxyquire = require("proxyquire")

// Import the Sequelize models from db/index.js
const { models } = require("../db")
const { Recipe, Ingredient, User, ShoppingList, ShoppingListIngredient } =
  models

// Create a mock for authenticateToken middleware
const authenticateTokenMock = (req, res, next) => {
  req.user = { id: 1, username: "testuser" }
  next()
}

// Use proxyquire to replace the actual authenticateToken middleware with the mock
const recipesRouter = proxyquire("./recipes", {
  "../auth/authenticateToken": authenticateTokenMock,
  // Mock axios to prevent real HTTP requests during tests
  axios: require("axios"),
})

// Initialize Express App for Testing
const app = express()
app.use(express.json())
app.use("/api/recipes", recipesRouter)

// Add error-handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message })
})

// Begin Test Suite
describe("Recipes API Endpoints", () => {
  afterEach(() => {
    sinon.restore() // Restore any stubs or mocks created by sinon
  })

  /**
   * Test GET /api/recipes?userId=1
   * Description: Retrieve all recipes for a user
   */
  describe("GET /api/recipes", () => {
    it("should return a list of recipes for the user", async () => {
      // Mock data
      const mockRecipes = [
        {
          id: 1,
          name: "Spaghetti Bolognese",
          description: "Classic Italian pasta dish.",
          rating: 4.5,
          image: "spaghetti.jpg",
          cuisineType: "Italian",
          userId: 1,
          Ingredients: [
            { id: 201, name: "Spaghetti" },
            { id: 202, name: "Ground Beef" },
          ],
        },
        {
          id: 2,
          name: "Chicken Curry",
          description: "Spicy and savory curry.",
          rating: 4.7,
          image: "chicken_curry.jpg",
          cuisineType: "Indian",
          userId: 1,
          Ingredients: [
            { id: 203, name: "Chicken" },
            { id: 204, name: "Curry Powder" },
          ],
        },
      ]

      // Stub Recipe.findAll to return mockRecipes
      sinon.stub(Recipe, "findAll").resolves(mockRecipes)

      const response = await supertest(app)
        .get("/api/recipes")
        .query({ userId: 1 })
        .expect(200)

      expect(response.body).to.be.an("array").that.has.lengthOf(2)
      response.body.forEach((recipe) => {
        expect(recipe).to.include.keys(
          "id",
          "name",
          "description",
          "rating",
          "image",
          "cuisineType",
          "userId",
          "Ingredients"
        )
        expect(recipe.userId).to.equal(1)
        expect(recipe.Ingredients).to.be.an("array").with.length.greaterThan(0)
        recipe.Ingredients.forEach((ingredient) => {
          expect(ingredient).to.include.keys("id", "name")
        })
      })
    })

    it("should return an empty array if the user has no recipes", async () => {
      // Stub Recipe.findAll to return empty array for userId: 999
      sinon.stub(Recipe, "findAll").resolves([])

      const response = await supertest(app)
        .get("/api/recipes")
        .query({ userId: 999 })
        .expect(200)

      expect(response.body).to.be.an("array").that.is.empty
    })

    it("should handle database errors gracefully", async () => {
      // Stub Recipe.findAll to throw an error
      sinon.stub(Recipe, "findAll").throws(new Error("Database failure"))

      const response = await supertest(app)
        .get("/api/recipes")
        .query({ userId: 1 })
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })

  /**
   * Test GET /api/recipes/recs?cuisinePref=Italian
   * Description: Retrieve recommended recipes, optionally filtered by cuisine preference
   */
  describe("GET /api/recipes/recs", () => {
    it("should return recommended recipes sorted by cuisine preference", async () => {
      // Mock data
      const mockRecRecipes = [
        {
          id: 3,
          name: "Margherita Pizza",
          description: "Fresh and cheesy pizza.",
          rating: 4.6,
          image: "margherita_pizza.jpg",
          cuisineType: "Italian",
          userId: null,
          Ingredients: [
            { id: 205, name: "Pizza Dough" },
            { id: 206, name: "Mozzarella" },
          ],
        },
        {
          id: 4,
          name: "Beef Tacos",
          description: "Delicious beef tacos.",
          rating: 4.4,
          image: "beef_tacos.jpg",
          cuisineType: "Mexican",
          userId: null,
          Ingredients: [
            { id: 207, name: "Taco Shells" },
            { id: 208, name: "Ground Beef" },
          ],
        },
      ]

      // Stub Recipe.findAll to return mockRecRecipes
      sinon.stub(Recipe, "findAll").resolves(mockRecRecipes)

      const response = await supertest(app)
        .get("/api/recipes/recs")
        .query({ cuisinePref: "Italian" })
        .expect(200)

      expect(response.body).to.be.an("array").that.has.lengthOf(2)

      // Expect Italian cuisine recipes to come first
      expect(response.body[0].cuisineType).to.equal("Italian")
      expect(response.body[1].cuisineType).to.equal("Mexican")
    })

    it("should return all recommended recipes if no cuisine preference is provided", async () => {
      // Mock data
      const mockRecRecipes = [
        {
          id: 3,
          name: "Margherita Pizza",
          description: "Fresh and cheesy pizza.",
          rating: 4.6,
          image: "margherita_pizza.jpg",
          cuisineType: "Italian",
          userId: null,
          Ingredients: [
            { id: 205, name: "Pizza Dough" },
            { id: 206, name: "Mozzarella" },
          ],
        },
        {
          id: 4,
          name: "Beef Tacos",
          description: "Delicious beef tacos.",
          rating: 4.4,
          image: "beef_tacos.jpg",
          cuisineType: "Mexican",
          userId: null,
          Ingredients: [
            { id: 207, name: "Taco Shells" },
            { id: 208, name: "Ground Beef" },
          ],
        },
      ]

      // Stub Recipe.findAll to return mockRecRecipes
      sinon.stub(Recipe, "findAll").resolves(mockRecRecipes)

      const response = await supertest(app).get("/api/recipes/recs").expect(200)

      expect(response.body).to.be.an("array").that.has.lengthOf(2)
      expect(response.body[0].cuisineType).to.equal("Italian")
      expect(response.body[1].cuisineType).to.equal("Mexican")
    })

    it("should return 200 with an empty array if no recommended recipes are found", async () => {
      // Stub Recipe.findAll to return empty array
      sinon.stub(Recipe, "findAll").resolves([])

      const response = await supertest(app).get("/api/recipes/recs").expect(200)

      expect(response.body).to.be.an("array").that.is.empty
    })

    it("should handle database errors gracefully", async () => {
      // Stub Recipe.findAll to throw an error
      sinon.stub(Recipe, "findAll").throws(new Error("Database failure"))

      const response = await supertest(app).get("/api/recipes/recs").expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })

  /**
   * Test GET /api/recipes/:id
   * Description: Retrieve a specific recipe by ID
   */
  describe("GET /api/recipes/:id", () => {
    it("should return the recipe with the given ID", async () => {
      // Mock data
      const mockRecipe = {
        id: 1,
        name: "Spaghetti Bolognese",
        description: "Classic Italian pasta dish.",
        rating: 4.5,
        image: "spaghetti.jpg",
        cuisineType: "Italian",
        userId: 1,
        Ingredients: [
          { id: 201, name: "Spaghetti" },
          { id: 202, name: "Ground Beef" },
        ],
      }

      // Stub Recipe.findOne to return mockRecipe
      sinon.stub(Recipe, "findOne").resolves(mockRecipe)

      const response = await supertest(app).get("/api/recipes/1").expect(200)

      expect(response.body).to.be.an("object")
      expect(response.body).to.include({
        id: 1,
        name: "Spaghetti Bolognese",
        description: "Classic Italian pasta dish.",
        rating: 4.5,
        image: "spaghetti.jpg",
        cuisineType: "Italian",
        userId: 1,
      })
      expect(response.body)
        .to.have.property("Ingredients")
        .that.is.an("array")
        .with.lengthOf(2)
      response.body.Ingredients.forEach((ingredient) => {
        expect(ingredient).to.include.keys("id", "name")
      })
    })

    it("should handle database errors gracefully", async () => {
      // Stub Recipe.findOne to throw an error
      sinon.stub(Recipe, "findOne").throws(new Error("Database failure"))

      const response = await supertest(app).get("/api/recipes/1").expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })

  /**
   * Test POST /api/recipes
   * Description: Create a new recipe
   */
  describe("POST /api/recipes", () => {
    it("should handle database errors gracefully", async () => {
      // Mock request body
      const newRecipeData = {
        name: "Vegetable Stir Fry",
        description: "A healthy vegetable stir fry.",
        rating: 4.2,
        image: "vegetable_stir_fry.jpg",
        cuisineType: "Chinese",
        userId: 1,
        ingredients: [
          { name: "Broccoli", recipeQty: 2 },
          { name: "Carrots", recipeQty: 1 },
        ],
      }

      // Stub Recipe.create to throw an error
      sinon.stub(Recipe, "create").throws(new Error("Database failure"))

      const response = await supertest(app)
        .post("/api/recipes")
        .send(newRecipeData)
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })

  describe("PUT /api/recipes/:id", () => {
    it("should handle database errors gracefully", async () => {
      // Stub Recipe.findByPk to throw an error
      sinon.stub(Recipe, "findByPk").throws(new Error("Database failure"))

      const updateData = {
        name: "Spaghetti Carbonara",
        description: "Creamy pasta with pancetta.",
        rating: 4.8,
        image: "spaghetti_carbonara.jpg",
        cuisineType: "Italian",
        ingredients: [
          { name: "Spaghetti", recipeQty: 2 },
          { name: "Pancetta", recipeQty: 1 },
        ],
      }

      const response = await supertest(app)
        .put("/api/recipes/1")
        .send(updateData)
        .expect(500)

      expect(response.body).to.have.property("error", "Database failure")
    })
  })
})
