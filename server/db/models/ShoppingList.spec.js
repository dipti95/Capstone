const { expect } = require("chai")
const Sequelize = require("sequelize")
const ShoppingListModel = require("./ShoppingList")

describe("ShoppingList Model", () => {
  it("should have default values and proper validations", async () => {
    const shoppingList = ShoppingListModel.build()

    expect(shoppingList.name).to.equal("")
    expect(shoppingList.status).to.equal("open")
    expect(shoppingList.totalCost).to.equal(0)
    expect(shoppingList.checkoutDate).to.be.undefined

    try {
      await shoppingList.validate()

      throw new Error("Validation should have failed but passed")
    } catch (validationError) {
      expect(validationError).to.exist
      expect(validationError.errors).to.have.lengthOf(1)
      expect(validationError.errors[0].path).to.equal("name")
      expect(validationError.errors[0].message).to.equal(
        "Validation notEmpty on name failed"
      )
    }
  })

  it("should accept valid values for all fields", async () => {
    const shoppingList = ShoppingListModel.build({
      name: "Groceries",
      status: "closed",
      totalCost: 123.45,
      checkoutDate: "2023-10-12",
    })

    await shoppingList.validate()

    expect(shoppingList.name).to.equal("Groceries")
    expect(shoppingList.status).to.equal("closed")
    expect(shoppingList.totalCost).to.equal(123.45)
    expect(shoppingList.checkoutDate).to.equal("2023-10-12")
  })

  it('should allow "checkoutDate" to be null', async () => {
    const shoppingList = ShoppingListModel.build({
      name: "Party Supplies",
      checkoutDate: null,
    })

    await shoppingList.validate()

    expect(shoppingList.checkoutDate).to.be.null
  })
})
