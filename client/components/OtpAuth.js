import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { useLocation } from "react-router-dom"
import { authenticateotp, forgotPassword } from "../store/auth"
import { Form, Button, Container } from "react-bootstrap"
import styles from "./AuthForm.module.css"

const OTPForm = () => {
  const location = useLocation()
  const { username } = location.state || {}
  const [otp, setOtp] = useState("")

  const { error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const handleSubmit = (evt) => {
    evt.preventDefault()
    dispatch(authenticateotp(otp, username))
  }

  return (
    <Container className={styles.authPageContainer}>
      <div className={styles.authFormContainer}>
        <Form className={styles.authForm} onSubmit={handleSubmit}>
          <h1 className={styles.formTitle}>Two-Factor Authentication</h1>
          <Form.Group>
            <Form.Label htmlFor="otp">A code has been sent to your email</Form.Label>
            <Form.Control
              name="otp"
              type="text"
              placeholder="Enter security code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="danger" className={styles.button} type="submit">
            Submit
          </Button>
          {error && <div className="error-message">{error}</div>}
        </Form>
      </div>
      <div className={styles.authPageImgContainer}>
        <img id={styles.authPageImg} src="/Login.jpg" alt="OTP" />
      </div>
    </Container>
  )
}

export default OTPForm
