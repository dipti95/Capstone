const Sequelize = require("sequelize")
const db = require("../db")

const Recipe = db.define("recipe", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },

  description: {
    type: Sequelize.TEXT,
  },

  rating: {
    type: Sequelize.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  },

  caloriesPerRecipe: {
    type: Sequelize.INTEGER,
  },

  proteinPerRecipe: {
    type: Sequelize.DECIMAL,
  },

  carbsPerRecipe: {
    type: Sequelize.DECIMAL,
  },

  fatPerRecipe: {
    type: Sequelize.DECIMAL,
  },

  image: {
    type: Sequelize.TEXT,
    defaultValue:
      "https://media.istockphoto.com/photos/fried-pork-and-vegetables-on-white-background-picture-id1190330112?k=20&m=1190330112&s=612x612&w=0&h=_TrmthJupdqYmMU-NC-es85TEvaBJsynDS383hqiAvM=",
  },

  cuisineType: {
    type: Sequelize.STRING,
  },

  frequency: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
})

module.exports = Recipe
