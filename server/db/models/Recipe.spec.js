const { expect } = require("chai")
const Recipe = require("./Recipe")

describe("Recipe Model", () => {
  describe("Field Validations", () => {
    it("should require a name", async () => {
      const recipe = Recipe.build({})
      try {
        await recipe.validate()
        throw new Error("Validation should have failed without a name.")
      } catch (error) {
        expect(error).to.exist
        expect(error.errors[0].path).to.equal("name")
        expect(error.errors[0].message).to.equal("recipe.name cannot be null")
      }
    })

    it("should enforce notEmpty validation on name", async () => {
      const recipe = Recipe.build({ name: "" })
      try {
        await recipe.validate()
        throw new Error("Validation should have failed with an empty name.")
      } catch (error) {
        expect(error).to.exist
        expect(error.errors[0].path).to.equal("name")
        expect(error.errors[0].message).to.equal(
          "Validation notEmpty on name failed"
        )
      }
    })

    it("should validate rating is between 1 and 5", async () => {
      const recipe = Recipe.build({ name: "Test Recipe", rating: 6 })
      try {
        await recipe.validate()
        throw new Error(
          "Validation should have failed with rating greater than 5."
        )
      } catch (error) {
        expect(error).to.exist
        expect(error.errors[0].path).to.equal("rating")
        expect(error.errors[0].message).to.equal(
          "Validation max on rating failed"
        )
      }
    })

    it("should set default values correctly", async () => {
      const recipe = Recipe.build({ name: "Test Recipe" })
      expect(recipe.image).to.equal(
        "https://media.istockphoto.com/photos/fried-pork-and-vegetables-on-white-background-picture-id1190330112?k=20&m=1190330112&s=612x612&w=0&h=_TrmthJupdqYmMU-NC-es85TEvaBJsynDS383hqiAvM="
      )
      expect(recipe.frequency).to.equal(0)
    })

    it("should create a recipe with valid data", async () => {
      const recipe = Recipe.build({
        name: "Spaghetti Bolognese",
        description: "A classic Italian pasta dish.",
        rating: 5,
        caloriesPerRecipe: 800,
        proteinPerRecipe: 25.5,
        carbsPerRecipe: 75.0,
        fatPerRecipe: 30.0,
        image: "https://example.com/spaghetti.jpg",
        cuisineType: "Italian",
        frequency: 10,
      })

      await recipe.validate()

      expect(recipe.name).to.equal("Spaghetti Bolognese")
      expect(recipe.description).to.equal("A classic Italian pasta dish.")
      expect(recipe.rating).to.equal(5)
      expect(recipe.caloriesPerRecipe).to.equal(800)
      expect(recipe.proteinPerRecipe).to.equal(25.5)
      expect(recipe.carbsPerRecipe).to.equal(75.0)
      expect(recipe.fatPerRecipe).to.equal(30.0)
      expect(recipe.image).to.equal("https://example.com/spaghetti.jpg")
      expect(recipe.cuisineType).to.equal("Italian")
      expect(recipe.frequency).to.equal(10)
    })
  })
})
