const Sequelize = require("sequelize")
const db = require("../db")

const Ingredient = db.define("ingredient", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },

  uom: {
    type: Sequelize.STRING,
    defaultValue: "each",
  },

  cost: {
    type: Sequelize.DECIMAL,
    defaultValue: 0.0,
  },

  category: {
    type: Sequelize.ENUM(
      "produce",
      "meat",
      "dairy",
      "dry goods",
      "bakery",
      "beverages",
      "miscellaneous"
    ),
    defaultValue: "miscellaneous",
  },

  caloriesPerUnit: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },

  proteinPerUnit: {
    type: Sequelize.DECIMAL,
    defaultValue: 0.0,
  },

  carbsPerUnit: {
    type: Sequelize.DECIMAL,
    defaultValue: 0.0,
  },

  fatsPerUnit: {
    type: Sequelize.DECIMAL,
    defaultValue: 0.0,
  },

  image: {
    type: Sequelize.STRING,
    defaultValue: "../../../Images/DummyImageForIngredient.jpg",
  },
})

module.exports = Ingredient
