import React, { useEffect } from "react"
import { useSelector, useDispatch} from "react-redux"
import { Route, Switch, Redirect, useLocation } from "react-router-dom"
import { Login, Signup } from "./components/AuthForm"
import Home from "./components/Home"
import { me } from "./store"

import ForgotPasswordForm from "./components/ForgotPasswordForm"

import Account from "./components/Account"
import ShoppingList from "./components/ShoppingList"
import ShoppingListHistoryAll from "./components/ShoppingListHistoryAll"
import ShoppingListHistorySingle from "./components/ShoppingListHistorySingle"
import Food from "./components/Food"
import PantrySingle from "./components/PantrySingle"
import Recipes from "./components/Recipes"
import SingleRecipe from "./components/SingleRecipe"
import EditRecipe from "./components/EditRecipe"
import AddRecipe from "./components/AddRecipe"
import NewPantryItem from "./components/NewPantryItem"
import HomeGuest from "./components/HomeGuest"
import PantryRefactor from "./components/PantryRefactor"
import OTPForm from "./components/OtpAuth"

/**
 * COMPONENT
 */

const Routes = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.id)
  const dispatch = useDispatch()
  const location = useLocation();

  useEffect(() => {
    // List of routes where you want to scroll to the top
    const scrollToTopRoutes = [
      "/list", 
      "/pantries", 
      "/pantries/add", 
      "/foods", 
      "/recipes", 
      "/recipes/add", 
      "/recipes/:id", 
      "/recipes/recommended/:id", 
      "/recipes/:id/edit", 
      "/home", 
      "/login", 
      "/signup"];

    // Check if the current route matches any in the list
    const shouldScrollToTop = scrollToTopRoutes.some((route) =>
      new RegExp(`^${route.replace(":id", "[^/]+")}$`).test(location.pathname)
    );

    if (shouldScrollToTop) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    dispatch(me())
  }, [])

  return (
    <div>
      {isLoggedIn ? (
        <Switch>
          <Route path="/account" component={Account} />

          <Route exact path="/list" component={ShoppingList} />
          <Route
            exact
            path="/list/history"
            component={ShoppingListHistoryAll}
          />
          <Route
            exact
            path="/list/:listId"
            component={ShoppingListHistorySingle}
          />
          <Route exact path="/pantries" component={PantryRefactor} />
          <Route exact path="/pantries/add" component={NewPantryItem} />
          <Route exact path="/pantries/:id" component={PantrySingle} />
          <Route path="/foods" component={Food} />
          <Route exact path="/recipes" component={Recipes} />
          <Route exact path="/recipes/add" component={AddRecipe} />
          <Route exact path="/recipes/:id" component={SingleRecipe} />
          <Route
            exact
            path="/recipes/recommended/:id"
            component={SingleRecipe}
          />
          <Route exact path="/recipes/:id/edit" component={EditRecipe} />
          <Route path="/home" component={Home} />
          <Redirect to="/home" />
        </Switch>
      ) : (
        <Switch>
          <Route path="/" exact>
            {HomeGuest}
          </Route>
          <Route path="/login">{Login}</Route>
          <Route path="/signup">{Signup}</Route>
          <Route path="/forgot-password" component={ForgotPasswordForm} />
          <Route path="/otp" component={OTPForm} />
        </Switch>
      )}
    </div>
  )
}

export default Routes
