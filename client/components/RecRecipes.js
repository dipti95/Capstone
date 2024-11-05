import React, { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import {
  showRecRecipes,
  getNewRecRecipes,
  removeRecRecipe,
} from "../store/recRecipes"
import { getOurFoods } from "../store/pantriesFoods"
import { addRecToMyRecipes } from "../store/recipes"
import styles from "./RecRecipes.module.css"
import { Card, Button, Container } from "react-bootstrap"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

const RecRecipes = () => {
  const { id, cuisinePref, diet, health } = useSelector((state) => state.auth)
  let { recRecipes, pantriesFoods, recipes } = useSelector((state) => state)
  const dispatch = useDispatch()
  const [currentView, setCurrentView] = useState(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    dispatch(showRecRecipes(cuisinePref))
    dispatch(getOurFoods(id))
  }, [])

  const didMount = useRef(false)

  useEffect(() => {
    function getMoreRecs() {
      let apiParams = ""

      if (cuisinePref && cuisinePref !== "No Preference") {
        apiParams += `&cuisineType=${cuisinePref}`
      }
      if (diet) {
        apiParams += `&diet=${diet}`
      }
      if (health) {
        apiParams += `&health=${health}`
      }
      apiParams += "&random=true"
      dispatch(getNewRecRecipes(apiParams))
    }

    if (didMount.current) {
      if (recRecipes.length < 5) {
        console.log("recRecipes.length: ", recRecipes.length)
        getMoreRecs()
      } else if (
        recRecipes.length &&
        cuisinePref &&
        !recRecipes.filter(
          (recRecipe) =>
            recRecipe.cuisineType.toLowerCase() === cuisinePref.toLowerCase()
        ).length
      ) {
        console.log(
          "Not enough recs to meet your cuisine preference. Getting more!"
        )
        getMoreRecs()
      }
    } else {
      didMount.current = true
    }
  }, [recRecipes])

  const expandView = (id) => {
    if (id !== currentView) {
      setCurrentView(id)
    } else {
      setCurrentView(null)
    }
  }

  function sortByAvailablility(recipes) {
    const combinedTotals = {}
    pantriesFoods.forEach((food) => {
      if (combinedTotals[food.name]) {
        combinedTotals[food.name] += food.pantryIngredient.pantryQty
      } else {
        combinedTotals[food.name] = food.pantryIngredient.pantryQty
      }
    })

    recipes.forEach((recipe) => {
      recipe["needsIngredients"] = recipe.ingredients.length
      recipe.ingredients.forEach((ingredient) => {
        if (
          ingredient.recipeIngredient.recipeQty <=
          combinedTotals[ingredient.name]
        ) {
          recipe.needsIngredients -= 1
        }
      })
    })

    recipes.sort((a, b) => a.needsIngredients - b.needsIngredients)
    return recipes
  }

  function sortByCuisinePref(recipes) {
    let matches = []
    let nonMatches = []
    recipes.forEach((recipe) => {
      if (recipe.cuisineType === cuisinePref) {
        matches.push(recipe)
      } else {
        nonMatches.push(recipe)
      }
    })
    const sortedResults = matches.concat(nonMatches)
    return sortedResults
  }

  function addToMyRecipes(recipeId) {
    dispatch(addRecToMyRecipes(recipeId, id))
    dispatch(removeRecRecipe(recipeId))
  }

  recRecipes = sortByAvailablility(recRecipes)

  recRecipes = sortByCuisinePref(recRecipes)

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex)
  }

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  }

  return (
    <Carousel responsive={responsive} arrows showDots={false}>
      {recRecipes.map((recipe) => (
        <Card
          key={recipe.id}
          className={
            recipe.id === currentView
              ? styles.expandedCard
              : styles.recRecipeCard
          }
        >
          <Card.Img
            variant="top"
            className={styles.recipeImg}
            src={recipe.image}
          />
          <Card.Body>
            <Card.Title>
              {recipe.id === currentView
                ? recipe.name
                : recipe.name.slice(0, 20)}
              {recipe.id !== currentView && recipe.name.length > 20
                ? "..."
                : ""}
            </Card.Title>
            <Link to={`/recipes/recommended/${recipe.id}`}>
              <Button variant="primary" className={styles.button}>
                View
              </Button>
            </Link>
            <Button
              variant="outline-primary"
              className={styles.buttonOutline}
              onClick={() => addToMyRecipes(recipe.id)}
            >
              Add to My Recipes
            </Button>
          </Card.Body>
        </Card>
      ))}
    </Carousel>
  )
}

export default RecRecipes
