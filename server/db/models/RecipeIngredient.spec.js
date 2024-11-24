const { expect } = require("chai")
const Sequelize = require("sequelize")
const RecipeIngredientModel = require("./RecipeIngredient") // Adjust the path if necessary

describe("RecipeIngredient Model", () => {
  it('should allow setting and getting the "recipeQty" field', () => {
    // Create an instance of RecipeIngredient without saving to the database
    const recipeIngredient = RecipeIngredientModel.build({
      recipeQty: 2.5,
    })

    // Assert that recipeQty is set correctly
    expect(recipeIngredient.recipeQty).to.equal(2.5)
  })

  it("should accept decimal values with multiple decimal places", () => {
    const recipeIngredient = RecipeIngredientModel.build({
      recipeQty: 3.14159,
    })

    expect(recipeIngredient.recipeQty).to.equal(3.14159)
  })

  it('should accept null values for "recipeQty"', () => {
    const recipeIngredient = RecipeIngredientModel.build({})

    expect(recipeIngredient.recipeQty).to.be.undefined
  })
})
