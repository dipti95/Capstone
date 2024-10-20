import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { forgotPassword } from "../store/auth" // Import the action
import { Form, Button, Container } from "react-bootstrap"
import styles from "./AuthForm.module.css"

const ForgotPasswordForm = () => {
  const [username, setUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const { error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const handleSubmit = (evt) => {
    evt.preventDefault()
    dispatch(forgotPassword(username, newPassword)) // Dispatch the action with username and new password
  }

  return (
    <Container className={styles.authPageContainer}>
      <div className={styles.authFormContainer}>
        <Form className={styles.authForm} onSubmit={handleSubmit}>
          <h1 className={styles.formTitle}>Forgot Password</h1>
          <Form.Group>
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Control
              name="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="password">New Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="danger" className={styles.button} type="submit">
            Reset Password
          </Button>
          {error && <div className="error-message">{error}</div>}
        </Form>
      </div>
      <div className={styles.authPageImgContainer}>
        <img id={styles.authPageImg} src="/Login.jpg" alt="Forgot Password" />
      </div>
    </Container>
  )
}

export default ForgotPasswordForm
