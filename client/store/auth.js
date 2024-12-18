import axios from "axios"
import history from "../history"

const TOKEN = "token"

/**
 * ACTION TYPES
 */
const SET_AUTH = "SET_AUTH"

/**
 * ACTION CREATORS
 */
const setAuth = (auth) => ({ type: SET_AUTH, auth })

/**
 * THUNK CREATORS
 */
export const me = () => async (dispatch) => {
  const token = window.localStorage.getItem(TOKEN)
  if (token) {
    const res = await axios.get("/auth/me", {
      headers: {
        authorization: token,
      },
    })
    return dispatch(setAuth(res.data))
  }
}

export const authenticateLogin = (username, password) => async (dispatch) => {
  try {
    const res = await axios.post(`/auth/login`, { username, password })

    window.localStorage.setItem(TOKEN, res.data.token)

    history.push("/otp", { username })
  } catch (authError) {
    return dispatch(setAuth({ error: authError }))
  }
}

export const authenticateSignup =
  (username, email, password) => async (dispatch) => {
    try {
      const res = await axios.post(`/auth/signup`, {
        username,

        email,
        password,
      })

      window.localStorage.setItem(TOKEN, res.data.token)

      dispatch(me())
      history.push("/account")
    } catch (authError) {
      return dispatch(setAuth({ error: authError }))
    }
  }
export const authenticateotp = (otp, username) => async (dispatch) => {
  try {
    const res = await axios.post(`/auth/otp`, { otp, username })
    window.localStorage.setItem(TOKEN, res.data.token)
    dispatch(me())
  } catch (authError) {
    return dispatch(setAuth({ error: authError }))
  }
}

export const update = (newAccount) => async (dispatch) => {
  const token = window.localStorage.getItem(TOKEN)
  if (token) {
    const res = await axios.put("/auth/me", {
      headers: {
        authorization: token,
      },
      newAccount,
    })

    dispatch(setAuth(res.data))
    history.push("/recipes")
  }
}

export const logout = () => {
  window.localStorage.removeItem(TOKEN)
  history.push("/")
  return {
    type: SET_AUTH,
    auth: {},
  }
}

export const forgotPassword = (username, newPassword) => async (dispatch) => {
  try {
    await axios.put("/auth/forgot-password", { username, newPassword })

    dispatch(setAuth({}))

    history.push("/login")
  } catch (error) {
    dispatch(
      setAuth({ error: error.response?.data || "Error resetting password" })
    )
  }
}

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case SET_AUTH:
      return action.auth

    default:
      return state
  }
}
