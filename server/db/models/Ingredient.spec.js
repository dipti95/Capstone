const { expect } = require("chai")
const Ingredient = require("./Ingredient")

describe("Ingredient Model", () => {
  describe("Field Validations", () => {
    it("should require a name", async () => {
      const ingredient = Ingredient.build({})
      try {
        await ingredient.validate()
        throw new Error("Validation should have failed without a name.")
      } catch (error) {
        expect(error).to.exist
        expect(error.errors[0].path).to.equal("name")
        expect(error.errors[0].message).to.equal(
          "ingredient.name cannot be null"
        )
      }
    })

    it("should enforce notEmpty validation on name", async () => {
      const ingredient = Ingredient.build({ name: "" })
      try {
        await ingredient.validate()
        throw new Error("Validation should have failed with empty name.")
      } catch (error) {
        expect(error).to.exist
        expect(error.errors[0].path).to.equal("name")
        expect(error.errors[0].message).to.equal(
          "Validation notEmpty on name failed"
        )
      }
    })

    it("should set default values correctly", async () => {
      const ingredient = Ingredient.build({ name: "Sugar" })

      expect(ingredient.name).to.equal("Sugar")
      expect(ingredient.uom).to.equal("each")
      expect(ingredient.category).to.equal("miscellaneous")
      expect(ingredient.caloriesPerUnit).to.equal(0)
      expect(ingredient.proteinPerUnit).to.equal(0)
      expect(ingredient.carbsPerUnit).to.equal(0)
      expect(ingredient.fatsPerUnit).to.equal(0)
      expect(ingredient.image).to.equal(
        "https://media.istockphoto.com/photos/fried-pork-and-vegetables-on-white-background-picture-id1190330112?k=20&m=1190330112&s=612x612&w=0&h=_TrmthJupdqYmMU-NC-es85TEvaBJsynDS383hqiAvM="
      )
    })

    it("should allow setting custom values", async () => {
      const ingredient = Ingredient.build({
        name: "Butter",
        uom: "grams",
        category: "dairy",
        caloriesPerUnit: 717,
        proteinPerUnit: 0.85,
        carbsPerUnit: 0.06,
        fatsPerUnit: 81.11,
        image: "https://example.com/butter.jpg",
      })

      expect(ingredient.name).to.equal("Butter")
      expect(ingredient.uom).to.equal("grams")
      expect(ingredient.category).to.equal("dairy")
      expect(ingredient.caloriesPerUnit).to.equal(717)
      expect(ingredient.proteinPerUnit).to.equal(0.85)
      expect(ingredient.carbsPerUnit).to.equal(0.06)
      expect(ingredient.fatsPerUnit).to.equal(81.11)
      expect(ingredient.image).to.equal("https://example.com/butter.jpg")
    })
  })
})
