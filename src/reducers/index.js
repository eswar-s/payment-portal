import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import auth from './auth'
import invoice from './invoice'

export default combineReducers({
  routing: routerReducer,
  auth,
  invoice
})