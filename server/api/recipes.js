const router = require("express").Router()
module.exports = router
const Recipe = require("../db/models/Recipe")
const Ingredient = require("../db/models/Ingredient")
const User = require("../db/models/User")
const ShoppingList = require("../db/models/ShoppingList")
const ShoppingListIngredient = require("../db/models/ShoppingListIngredient")
const { Op } = require("@sequelize/core")
const axios = require("axios")
const authenticateToken = require("../auth/authenticateToken")

// GET /api/recipes?userId=1
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll({
      where: { userId: req.query.userId },
      include: Ingredient,
    })

    if (!recipes) {
      next({ status: 404, message: "No recipes found." })
    }

    res.send(recipes)
  } catch (error) {
    next(error)
  }
})

// GET /api/recipes/recs?cuisinePref=STRING
router.get("/recs", authenticateToken, async (req, res, next) => {
  try {
    let recRecipes = await Recipe.findAll({
      where: { userId: { [Op.is]: null } },
      include: Ingredient,
    })
    if (!recRecipes) {
      next({ status: 404, message: "No recommended recipes found." })
    }

    if (req.query.cuisinePref) {
      const { cuisinePref } = req.query
      let matches = []
      let nonMatches = []
      recRecipes.forEach((recipe) => {
        if (recipe.cuisineType === cuisinePref) {
          matches.push(recipe)
        } else {
          nonMatches.push(recipe)
        }
      })
      recRecipes = matches.concat(nonMatches)
    }

    res.send(recRecipes)
  } catch (error) {
    next(error)
  }
})

// GET /api/recipes/:id
router.get("/:id", authenticateToken, async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({
      where: {
        id: req.params.id,
      },
      include: Ingredient,
    })

    if (!recipe) {
      next({ status: 404, message: `Recipe no. ${req.params.id} not found.` })
    }

    res.send(recipe)
  } catch (error) {
    next(error)
  }
})

// POST /api/recipes
router.post("/", authenticateToken, async (req, res, next) => {
  try {
    const {
      name,
      description,
      rating,
      image,
      cuisineType,
      userId,
      ingredients,
    } = req.body

    const newRecipe = await Recipe.create({
      name,
      description,
      rating,
      cuisineType,
    })

    //If there is no image, we want it to get the default value.
    if (image) {
      await newRecipe.update({ image })
    }

    const user = await User.findByPk(userId)

    await newRecipe.setUser(user)

    ingredients.map(async (ingredient) => {
      let ingredientToAdd = await Ingredient.findOne({
        where: {
          name: ingredient.name,
        },
      })

      if (!ingredientToAdd) {
        ingredientToAdd = await Ingredient.create(ingredient)
      }

      await newRecipe.addIngredient(ingredientToAdd, {
        through: { recipeQty: ingredient.recipeQty },
      })
    })

    res.send(newRecipe)
  } catch (error) {
    next(error)
  }
})

//POST api/recipes/recs
router.post("/recs", authenticateToken, async (req, res, next) => {
  try {
    const {
      name,
      description,
      image,
      cuisineType,
      caloriesPerRecipe,
      proteinPerRecipe,
      carbsPerRecipe,
      fatPerRecipe,
      ingredients,
    } = req.body

    let newRecipe = await Recipe.create({
      name,
      description,
      image,
      cuisineType,
      caloriesPerRecipe,
      proteinPerRecipe,
      carbsPerRecipe,
      fatPerRecipe,
    })

    await Promise.all(
      ingredients.map(async (ingredient) => {
        let ingredientToAdd = await Ingredient.findOne({
          where: {
            name: ingredient.name,
          },
        })

        if (!ingredientToAdd) {
          ingredientToAdd = await Ingredient.create(ingredient)
        }

        await newRecipe.addIngredient(ingredientToAdd, {
          through: { recipeQty: ingredient.quantity },
        })
      })
    )

    newRecipe = await Recipe.findOne({
      where: {
        name: newRecipe.name,
        userId: null,
      },
      include: Ingredient,
    })

    res.send(newRecipe)
  } catch (error) {
    next(error)
  }
})

//POST /api/recipes/recs/new

router.post("/recs/new", authenticateToken, async (req, res, next) => {
  try {
    let apiRequest = `https://api.edamam.com/api/recipes/v2?type=public&q=&app_id=${process.env.REACT_APP_RECIPE_APP_ID}&app_key=${process.env.REACT_APP_RECIPE_KEY}&mealType=Dinner`

    const { apiParams } = req.body
    apiRequest += apiParams
    const apiResponse = await axios.get(encodeURI(apiRequest))
    const hits = apiResponse.data.hits

    if (hits) {
      res.send(hits)
    }
  } catch (error) {
    next(error)
  }
})

// PUT /api/recipes/recs/:id?userId=INT
router.put("/recs/:id", async (req, res, next) => {
  try {
    const recRecipeId = req.params.id
    const { userId } = req.query

    const recRecipe = await Recipe.findByPk(recRecipeId, {
      include: Ingredient,
    })
    const user = await User.findByPk(userId)
    await recRecipe.setUser(user)

    const shoppingList = await ShoppingList.findOne({
      where: {
        status: "open",
        userId: userId,
      },
      include: Ingredient,
    })

    await Promise.all(
      recRecipe.ingredients.map(async (ingredient) => {
        const slIngredient = await ShoppingListIngredient.findOne({
          where: {
            ingredientId: ingredient.id,
            shoppingListId: shoppingList.id,
          },
        })

        if (slIngredient) {
          await slIngredient.update({
            sliQuantity: slIngredient.sliQuantity + 1,
          })
        } else {
          await ingredient.addShoppingList(shoppingList, {
            through: { sliQuantity: 1 },
          })
        }
      })
    )
    const updatedRecipe = await Recipe.findByPk(recRecipeId)
    res.send(updatedRecipe)
  } catch (error) {
    next(error)
  }
})

// PUT /api/recipes/:id
router.put("/:id", authenticateToken, async (req, res, next) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id)

    if (!recipe) {
      next({ status: 404, message: `Recipe no. ${req.params.id} not found.` })
    }

    const { name, description, rating, image, cuisineType, ingredients } =
      req.body

    const updatedRecipe = await recipe.update({
      name,
      description,
      rating,
      image,
      cuisineType,
    })

    const currentIngredients = await updatedRecipe.getIngredients()

    const newIngredientNames = ingredients.map((ingredient) => ingredient.name)

    ingredients.map(async (ingredient) => {
      let ingredientToAdd = await Ingredient.findOne({
        where: {
          name: ingredient.name,
        },
      })

      if (!ingredientToAdd) {
        ingredientToAdd = await Ingredient.create(ingredient)
      }

      await updatedRecipe.addIngredient(ingredientToAdd, {
        through: { recipeQty: ingredient.recipeQty },
      })

      currentIngredients.map(async (ingredient) => {
        if (!newIngredientNames.includes(ingredient.dataValues.name)) {
          const ingredientToRemove = await Ingredient.findOne({
            where: {
              name: ingredient.dataValues.name,
            },
          })

          await updatedRecipe.removeIngredient(ingredientToRemove)
        }
      })
    })

    const newUpdatedRecipe = await Recipe.findByPk(req.params.id)

    res.send(newUpdatedRecipe)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/recipe/:id
router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id)

    if (!recipe) {
      next({ status: 404, message: `Recipe no. ${req.params.id} not found.` })
    }

    const result = await recipe.destroy()

    if (result.length) {
      next({
        status: 404,
        message: `Failed to destroy recipe no. ${req.params.id}`,
      })
    }

    res.send(recipe)
  } catch (error) {
    next(error)
  }
})
