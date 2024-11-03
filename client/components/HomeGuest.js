import React, { useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { Link } from "react-router-dom"
import { Carousel, Container, Button, Card } from "react-bootstrap"
import styles from "./HomeGuest.module.css"

const HomeGuest = () => {
  return (
    <div>
      <Container className={styles.guestHomeContainer}>
        <Container className={styles.headerContainer}>
          <div className={styles.welcomeContainer}>
            <Container className={styles.container}>
              <h1 className={styles.introduction}>Food Buddy</h1>
            </Container>
            <Container className={styles.container}>
            <h2 className={styles.tagline}>Nutritious food and a stocked pantry. Always.</h2>
            </Container>
            <div className={styles.buttonContainer}>
              <Link to="/signup">
                <Button
                  className={styles.button}
                  variant="primary"
                  style={{ fontSize: "20px" }}
                >
                  Sign Up
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  className={styles.loginBtn}
                  variant="outline-primary"
                  style={{ fontSize: "20px" }}
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </Container>
        <hr />
        <h2 style={{ margin: "25px", fontSize: "42px" }}>
          Take control of your kitchen life.
        </h2>
        <div className={styles.cardContainer}>
          <Card className={styles.card}>
            <Card.Img
              variant="top"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU1Wuo0J-W1BVx5O7F-4zRRT7DZvU9Pz64vQ&usqp=CAU"
              className={styles.cardImg}
            />
            <Card.Body>
              <Card.Title>Shopping Lists</Card.Title>
              <Card.Text>
                Build your shopping lists from a comprehensive list of food
                items.
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className={styles.card}>
            <Card.Img
              variant="top"
              src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/hbx100119kitchenalicelane-013-copy-1567786355.jpg?resize=480:*"
              className={styles.cardImg}
            />
            <Card.Body>
              <Card.Title>Pantry</Card.Title>
              <Card.Text>
                Easily receive items from your shopping list into your pantry.
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className={styles.card}>
            <Card.Img
              variant="top"
              src="https://img.delicious.com.au/fVd1u6k7/w1200/del/2022/02/chicken-chickpea-curry-163942-1.jpg"
              className={styles.cardImg}
            />
            <Card.Body>
              <Card.Title>Recipes</Card.Title>
              <Card.Text>
                Store your recipes, generate shopping lists and always know if
                you have ingredients in stock.
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className={styles.card}>
            <Card.Img
              variant="top"
              src="https://desikhazana.in/wp-content/uploads/2020/10/chana-masala-fb809bc.jpg"
              className={styles.cardImg}
            />
            <Card.Body>
              <Card.Title>Recommendations</Card.Title>
              <Card.Text>
                Don't know what to cook? Try one of FoodBuddy's recommended
                recipes based on your preferences.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default HomeGuest
