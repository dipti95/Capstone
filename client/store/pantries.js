import axios from "axios"

// TOKEN

const TOKEN = "token"

// ACTION TYPE

const SHOW_ALL = "SHOW_ALL"
const CREATE_NEW_PANTRY = "CREATE_NEW_PANTRY"

// ACTION CREATORS

export const showAll = (allPantries) => ({
  type: SHOW_ALL,
  allPantries,
})

export const _createNewPantry = (newPantry) => ({
  type: CREATE_NEW_PANTRY,
  newPantry,
})

// THUNKS

export const fetchAllPantries = (id) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem(TOKEN)
      const { data } = await axios.get(`/api/pantries?userId=${id}`, {
        headers: {
          authorization: token,
        },
      })
      dispatch(showAll(data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const createNewPantry = (name, id) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem(TOKEN)
      const { data } = await axios.post(
        "/api/pantries",
        { name, id },
        {
          headers: {
            authorization: token,
          },
        }
      )
      //console.log("our data", data)
      dispatch(_createNewPantry(data))
    } catch (error) {
      console.log(error)
    }
  }
}

const initialState = []

const pantriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ALL:
      return action.allPantries
    case CREATE_NEW_PANTRY:
      return [...state, action.newPantry]
    default:
      return state
  }
}

export default pantriesReducer
