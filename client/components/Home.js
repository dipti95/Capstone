import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchAllPantries } from "../store/pantries"
import Visuals from "./Visuals"
import Visual2 from "./Visual2"
import ListNutritionGraph from "./ListNutritionGraph"
import VisualNutrition from "./VisualNutrition"
import styles from "./Home.module.css"
import { Card } from "react-bootstrap"

/**
 * COMPONENT
 */
const Home = (props) => {
  const { username, id } = useSelector((state) => state.auth)

  const { pantries } = useSelector((state) => state.pantries)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllPantries(id))
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>Dashboard</h1>
      </div>
      <div className={styles.charts}>
        <Card className={styles.chartCard}>
          <Card.Body>
            <Visual2 />
          </Card.Body>
        </Card>
        <Card className={styles.chartCard}>
          <Card.Body>
            <Visuals />
          </Card.Body>
        </Card>
        <Card className={styles.chartCard}>
          <Card.Body>
            <VisualNutrition />
          </Card.Body>
        </Card>
        <Card className={styles.chartCard}>
          <Card.Body>
            <ListNutritionGraph />
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default Home
