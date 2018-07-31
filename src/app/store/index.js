import { applyMiddleware, createStore } from 'redux'

import { createLogger as logger } from 'redux-logger'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
import reducer from '../reducers'

// thunk allows function return instead of object return in actions
// use promises when api calls doesn't need to be modified.
// template for promises in actions
// store.dispatch({type: "name", payload: axios.get('url')})
// const middleware = applyMiddleware(promise(), thunk, logger())

const middleware = applyMiddleware(promise(), thunk, logger())

export default createStore(reducer, middleware)
