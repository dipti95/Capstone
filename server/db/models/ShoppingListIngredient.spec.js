const { expect } = require("chai")
const Sequelize = require("sequelize")
const ShoppingListIngredientModel = require("./ShoppingListIngredient")

describe("ShoppingListIngredient Model", () => {
  it("should have default values and proper validations", async () => {
    const sli = ShoppingListIngredientModel.build()

    expect(sli.sliQuantity).to.be.undefined
    expect(sli.cost).to.equal(0)
    expect(sli.uom).to.equal("each")

    await sli.validate()
  })

  it("should accept valid values for all fields", async () => {
    const sli = ShoppingListIngredientModel.build({
      sliQuantity: 10,
      cost: 15.99,
      uom: "kg",
    })

    await sli.validate()

    expect(sli.sliQuantity).to.equal(10)
    expect(sli.cost).to.equal(15.99)
    expect(sli.uom).to.equal("kg")
  })

  it('should enforce validation on "cost" field for negative values', async () => {
    const sli = ShoppingListIngredientModel.build({
      cost: -5.0,
    })

    try {
      await sli.validate()
      throw new Error("Validation should have failed but passed")
    } catch (validationError) {
      expect(validationError).to.exist
      expect(validationError.errors).to.have.lengthOf(1)
      expect(validationError.errors[0].path).to.equal("cost")
      expect(validationError.errors[0].message).to.include(
        "Validation min on cost failed"
      )
    }
  })

  it('should allow "sliQuantity" to be null', async () => {
    const sli = ShoppingListIngredientModel.build({
      cost: 10.0,
    })

    await sli.validate()

    expect(sli.sliQuantity).to.be.undefined
  })

  it('should accept "uom" as a string and have a default value', async () => {
    const sli = ShoppingListIngredientModel.build({})

    expect(sli.uom).to.equal("each")
  })
})
