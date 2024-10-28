const router = require("express").Router()
module.exports = router
const Ingredient = require("../db/models/Ingredient")
const Pantry = require("../db/models/Pantry")
const ShoppingList = require("../db/models/ShoppingList")
const Recipe = require("../db/models/Recipe")
const authenticateToken = require("../auth/authenticateToken")

//GET /api/ingredients/all
router.get("/all", authenticateToken, async (req, res, next) => {
  try {
    const foods = await Ingredient.findAll()
    res.send(foods)
  } catch (error) {
    next(error)
  }
})

//GET /api/ingredients?userId=INT
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    let ingredients = []

    const pantries = await Pantry.findAll({
      where: { userId: req.query.userId },
      include: Ingredient,
    })

    const shoppingLists = await ShoppingList.findAll({
      where: { userId: req.query.userId },
      include: Ingredient,
    })

    const recipes = await Recipe.findAll({
      where: { userId: req.query.userId },
      include: Ingredient,
    })

    if (pantries.length > 0) {
      ingredients = pantries.reduce((prev, pantry) => {
        return prev.concat(pantry.ingredients)
      }, [])
    }

    if (shoppingLists.length > 0) {
      ingredients = ingredients.concat(
        shoppingLists.reduce((prev, list) => {
          return prev.concat(list.ingredients)
        }, [])
      )
    }

    if (recipes.length > 0) {
      ingredients = ingredients.concat(
        recipes.reduce((prev, recipe) => {
          return prev.concat(recipe.ingredients)
        }, [])
      )
    }

    const foundFoods = []
    ingredients = ingredients.filter((food) => {
      const isFound = foundFoods.includes(food.id)
      if (!isFound) {
        foundFoods.push(food.id)
      }
      return !isFound
    })

    res.send(ingredients)
  } catch (error) {
    next(error)
  }
})

//GET api/ingredients/pantries?userId=INT

router.get("/pantries", authenticateToken, async (req, res, next) => {
  try {
    let ingredients = []

    const pantries = await Pantry.findAll({
      where: { userId: req.query.userId },
      include: Ingredient,
    })

    if (pantries.length > 0) {
      ingredients = pantries.reduce((prev, pantry) => {
        return prev.concat(pantry.ingredients)
      }, [])
    }

    res.send(ingredients)
  } catch (error) {
    next(error)
  }
})

//POST api/ingredients?userId=INT
router.post("/", authenticateToken, async (req, res, next) => {
  try {
    const newFood = req.body
    if (newFood) {
      const prevIngredient = await Ingredient.findOne({
        where: { name: newFood.name },
      })
      if (prevIngredient) {
        const newIngredient = await prevIngredient.update(newFood)
        res.send(newIngredient)
      } else {
        const newIngredient = await Ingredient.create(newFood)
        res.send(newIngredient)
      }
    }
  } catch (error) {
    next(error)
  }
})

//PUT api/ingredients/:id
router.put("/:id", authenticateToken, async (req, res, next) => {
  try {
    const newFood = req.body
    if (newFood) {
      const prevFood = await Ingredient.findByPk(req.params.id)
      if (prevFood) {
        const updatedFood = await prevFood.update(newFood)
        res.send(updatedFood)
      } else {
        console.log("Failed to find the existing food by its id")
      }
    }
  } catch (error) {
    next(error)
  }
})
