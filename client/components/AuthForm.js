import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { authenticate, authenticateLogin, authenticateSignup } from "../store"
import styles from "./AuthForm.module.css"
import { Form, Button, Container } from "react-bootstrap"
import { Link } from "react-router-dom"

/**
 * COMPONENT
 */
const AuthForm = ({ name, displayName }) => {
  const { error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const handleSubmit = (evt) => {
    evt.preventDefault()
    const formName = evt.target.name
    const username = evt.target.username.value
    const password = evt.target.password.value

    if (formName === "login") {
      dispatch(authenticateLogin(username, password))
    } else {
      const email = evt.target.email.value
      dispatch(authenticateSignup(username, email, password))
    }
  }

  return (
    <Container className={styles.authPageContainer}>
      <div className={styles.authFormContainer}>
        <Form className={styles.authForm} onSubmit={handleSubmit} name={name}>
          <h1 className={styles.formTitle}>{displayName}</h1>
          <Form.Group>
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Control
              name="username"
              type="text"
              placeholder="Enter username"
            />
          </Form.Group>
          {name === "signup" && (
            <Form.Group>
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Enter Email"
              />
            </Form.Group>
          )}
          <Form.Group>
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Enter Password"
            />
          </Form.Group>

          <Button variant="primary" className={styles.button} type="submit">
            {displayName}
          </Button>
          {name === "login" && (
            <div>
              <Link to="/forgot-password">Forgot your password?</Link>
            </div>
          )}
          {error && error.response && <div> {error.response.data} </div>}
        </Form>
      </div>
    </Container>
  )
}

export const Login = <AuthForm name="login" displayName="Login" />
export const Signup = <AuthForm name="signup" displayName="Sign Up" />
