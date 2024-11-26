import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchAllPantries, createNewPantry } from "../store/pantries"
import { Button, Form, Alert } from "react-bootstrap"
import styles from "./PantryCreate.module.css"

const PantryCreate = ({ onHide }) => {
  const { id } = useSelector((state) => state.auth)
  const [inputField, setInputField] = useState([{ name: "" }])
  const [showNotification, setShowNotification] = useState(false)
  const [createdPantryName, setCreatedPantryName] = useState("")

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllPantries(id))
  }, [dispatch, id])

  const handleFormChange = (index, e) => {
    const data = [...inputField]
    data[index][e.target.name] = e.target.value
    setInputField(data)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const pantryName = inputField[0]?.name

    if (pantryName) {
      dispatch(createNewPantry(inputField, id))
      setCreatedPantryName(pantryName)
      setShowNotification(true)

      setTimeout(() => {
        setShowNotification(false)
        setInputField([{ name: "" }])
        onHide()
      }, 3000)
    }
  }

  return (
    <div>
      {showNotification && (
        <Alert variant="success" className={styles.alert}>
          Pantry "{createdPantryName}" created successfully!
        </Alert>
      )}

      {!showNotification && (
        <Form className={styles.pantryForm} onSubmit={handleSubmit}>
          {inputField.map((input, index) => (
            <div key={index}>
              <Form.Control
                name="name"
                type="text"
                placeholder="Create Pantry"
                value={input.name}
                onChange={(e) => handleFormChange(index, e)}
              />
            </div>
          ))}
          <Button className={styles.button} type="submit">
            Create Pantry
          </Button>
        </Form>
      )}
    </div>
  )
}

export default PantryCreate
