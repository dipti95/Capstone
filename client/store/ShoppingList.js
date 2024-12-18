import axios from "axios"
import history from "../history"

// TOKEN
const TOKEN = "token"

// ACTION TYPE
const SHOPPING_HISTORY = "SHOPPING_HISTORY"
const CURRENT_SHOPPING_LIST = "CURRENT_SHOPPING_LIST"
const EDIT_LIST = "EDIT_LIST"
const TO_PANTRY = "TO_PANTRY"
const SINGLE_HISTORY_VIEW = "SINGLE_HISTORY_VIEW"

// ACTION CREATORS

const History = (shoppingHistory) => ({
  type: SHOPPING_HISTORY,
  shoppingHistory,
})
const CurrentList = (currentList) => ({
  type: CURRENT_SHOPPING_LIST,
  currentList,
})
const editList = (currentList) => ({
  type: EDIT_LIST,
  currentList,
})
const toPantry = (newList) => ({
  type: TO_PANTRY,
  newList,
})
const singleHistoryView = (singleHistory) => ({
  type: SINGLE_HISTORY_VIEW,
  singleHistory,
})

// THUNKS

export const fetchShoppingListHistory = (id) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem(TOKEN)
      const { data } = await axios.get(`/api/shoppinglist/all?userId=${id}`, {
        headers: {
          authorization: token,
        },
      })
      dispatch(History(data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const fetchCurrentShoppingList = (id) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem(TOKEN)
      const { data } = await axios.get(`/api/shoppinglist?userId=${id}`, {
        headers: {
          authorization: token,
        },
      })
      dispatch(CurrentList(data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const setSingleHistoryView = (listId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem(TOKEN)
      const { data } = await axios.get(`/api/shoppinglist/${listId}`, {
        headers: {
          authorization: token,
        },
      })
      dispatch(singleHistoryView(data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const editListThunk = (itemId, userId, quantity, cost) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem(TOKEN)
      const { data } = await axios.put(
        `/api/shoppinglist?userId=${userId}`,
        {
          itemId,
          quantity,
          cost,
        },
        {
          headers: {
            authorization: token,
          },
        }
      )
      dispatch(editList(data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const sendToPantry = (userId, currentList, pantryId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem(TOKEN)
      const { data } = await axios.post(
        `/api/shoppinglist?userId=${userId}`,
        {
          currentList,
          pantryId,
        },
        {
          headers: {
            authorization: token,
          },
        }
      )
      dispatch(toPantry(data))
    } catch (error) {
      console.log(error)
    }
    history.push("/pantries")
  }
}

const initialState = {}

const shoppingListReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_SHOPPING_LIST:
      return { ...state, currentList: action.currentList }
    case SHOPPING_HISTORY:
      return { ...state, shoppingHistory: action.shoppingHistory }
    case SINGLE_HISTORY_VIEW:
      return { ...state, singleHistory: action.singleHistory }
    case EDIT_LIST:
      return { ...state, currentList: action.currentList }
    case TO_PANTRY:
      return { ...state, currentList: action.newList }
    default:
      return state
  }
}

export default shoppingListReducer
