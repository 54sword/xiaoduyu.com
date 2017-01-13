import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import createLogger from 'redux-logger'
// import api from '../middleware/api';
import config from '../../config'


let middleware = [
    thunk,
    // api
]

// 判断是否是node的环境变量
if (!process.env.__NODE__ && config.debug) {
  middleware = [thunk, createLogger()]
}

export default function configureStore(initialState) {

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
    )
  )

  /*
  if (module.hot) {
    console.log('1231')
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default
      store.replaceReducer(nextReducer)
    })
  }
  */

  return store
}
