import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Route, Switch, Redirect } from "react-router-dom"
import { Login, Signup } from "./components/AuthForm"
import Home from "./components/Home"
import { me } from "./store"

import ForgotPasswordForm from "./components/ForgotPasswordForm"

/**
 * COMPONENT
 */

const Routes = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.id)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(me())
  }, [])

  return (
    <div>
      {isLoggedIn ? (
        <Switch>
          <Route path="/home" component={Home} />
          <Redirect to="/home" />
        </Switch>
      ) : (
        <Switch>
          <Route path="/login">{Login}</Route>
          <Route path="/signup">{Signup}</Route>
          <Route path="/forgot-password" component={ForgotPasswordForm} />
        </Switch>
      )}
    </div>
  )
}

export default Routes
