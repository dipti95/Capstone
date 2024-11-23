import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchAllPantries } from "../store/pantries"
import { fetchSinglePantry } from "../store/pantry"
import styles from "./PantryRefactor.module.css"
import PantrySingle from "./PantrySingle"
import PantryCreate from "./PantryCreate"
import { Form, Container, Button } from "react-bootstrap"
import { Link } from "react-router-dom"

const PantryRefactor = () => {
  const { id } = useSelector((state) => state.auth)
  const { pantries } = useSelector((state) => state)
  const pantry = useSelector((state) => state.pantry)
  const [selectedPantry, setSelectedPantry] = useState(pantry?.id || 0)
  const [sortBy, setSortBy] = useState("name")
  const [sortedIngredients, setSortedIngredients] = useState([])

  const dispatch = useDispatch()

  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchAllPantries(id))
    }
  }, [id, dispatch])

  useEffect(() => {
    if (selectedPantry) {
      dispatch(fetchSinglePantry(selectedPantry))
    }
  }, [selectedPantry, dispatch])

  useEffect(() => {
    if (pantry && pantry.ingredients) {
      const sorted = [...pantry.ingredients].sort((a, b) => {
        if (sortBy === "name") {
          return a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase())
        } else if (sortBy === "quantity") {
          return (
            (a?.pantryIngredient?.pantryQty || 0) -
            (b?.pantryIngredient?.pantryQty || 0)
          )
        } else if (sortBy === "category") {
          return a?.category
            ?.toLowerCase()
            .localeCompare(b?.category?.toLowerCase())
        }
        return 0
      })
      setSortedIngredients(sorted)
    }
  }, [pantry, sortBy])

  const handlePantryChange = (e) => {
    const pantryId = e.target.value
    setSelectedPantry(pantryId)
    dispatch(fetchSinglePantry(pantryId))
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>Pantry</h1>
      </div>
      <Container>
        <div className={styles.pantryFilterContainer}>
          <div className={styles.buttonGroup}>
            <Link to="/pantries/add">
              <Button className={styles.button} variant="primary">
                Add Items
              </Button>
            </Link>

            {!showCreateForm ? (
              <Button
                variant="outline-primary"
                className={styles.buttonOutline}
                onClick={() => setShowCreateForm(true)}
              >
                Create New Pantry
              </Button>
            ) : (
              <PantryCreate onHide={() => setShowCreateForm(false)} />
            )}
          </div>

          <div className={styles.pantryFilterBox}>
            <div>
              <Form.Label className={styles.label}>Select Pantry</Form.Label>
              <Form.Select
                name="pantries"
                onChange={handlePantryChange}
                value={selectedPantry}
              >
                {pantries.map((pantry) => (
                  <option key={pantry.id} value={pantry.id}>
                    {pantry.name}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className={styles.dropdownSpacer}></div>
            <div>
              <Form.Label className={styles.label}>Sort By</Form.Label>
              <Form.Select value={sortBy} onChange={handleSortChange}>
                <option value="name">Item</option>
                <option value="quantity">Quantity</option>
                <option value="category">Category</option>
              </Form.Select>
            </div>
          </div>
        </div>
      </Container>

      {selectedPantry && Object.keys(pantry).length ? (
        <PantrySingle ingredients={sortedIngredients} />
      ) : (
        <div>Nothing here.</div>
      )}
    </div>
  )
}

export default PantryRefactor
