const { expect } = require("chai")
const PantryIngredient = require("./PantryIngredient")

describe("PantryIngredient Model", () => {
  describe("Field Validations", () => {
    it("should require pantryQty to be at least 1", async () => {
      const pantryIngredient = PantryIngredient.build({ pantryQty: 0 })
      try {
        await pantryIngredient.validate()
        throw new Error(
          "Validation should have failed with pantryQty less than 1."
        )
      } catch (error) {
        expect(error).to.exist
        expect(error.errors[0].path).to.equal("pantryQty")
        expect(error.errors[0].message).to.equal(
          "Validation min on pantryQty failed"
        )
      }
    })

    it("should require cost to be at least 0.0", async () => {
      const pantryIngredient = PantryIngredient.build({ cost: -1.0 })
      try {
        await pantryIngredient.validate()
        throw new Error(
          "Validation should have failed with cost less than 0.0."
        )
      } catch (error) {
        expect(error).to.exist
        expect(error.errors[0].path).to.equal("cost")
        expect(error.errors[0].message).to.equal(
          "Validation min on cost failed"
        )
      }
    })

    it('should set default value of uom to "each"', async () => {
      const pantryIngredient = PantryIngredient.build({})
      expect(pantryIngredient.uom).to.equal("each")
    })

    it("should create a PantryIngredient with valid data", async () => {
      const pantryIngredient = PantryIngredient.build({
        pantryQty: 5,
        cost: 10.5,
        uom: "kg",
      })

      await pantryIngredient.validate()

      expect(pantryIngredient.pantryQty).to.equal(5)
      expect(pantryIngredient.cost).to.equal(10.5)
      expect(pantryIngredient.uom).to.equal("kg")
    })
  })
})
