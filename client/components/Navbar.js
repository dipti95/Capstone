import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { logout } from "../store"
import styles from "./Navbar.module.css"
import { Navbar as Nav, Container, NavDropdown } from "react-bootstrap"
import { FaUserCircle } from "react-icons/fa"

const Navbar = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.id)
  const dispatch = useDispatch()

  return (
    <Nav fixed="top" className={styles.navBar}>
      <Container>
        <Link to="/">
          <h1>FOODBUDDY</h1>
        </Link>
        <nav>
          {isLoggedIn ? (
            <Container className={styles.signedInLinks}>
              <NavDropdown
                title={<FaUserCircle size={25} />}
                id={styles.navdropdown}
              >
                <NavDropdown.Item href="/account">Account</NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={() => dispatch(logout())}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Container>
          ) : (
            <div>
              <Link to="/login" className={styles.navBarLink}>
                Login
              </Link>
              <Link to="/signup" className={styles.navBarLink}>
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </Container>
    </Nav>
  )
}

export default Navbar
