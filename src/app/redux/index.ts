import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { createLogger } from 'redux-logger';
import config from '@config/feature.config';

let middleware = [ thunk ];

// 如果是在客户端环境，那么打印redux日志
if (config.reduxLog) middleware.push(createLogger());

export default function configureStore(initialState = {}) {

  const store = createStore(
    combineReducers(rootReducer),
    initialState,
    compose(
      applyMiddleware(...middleware)
    )
  );

  /*
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }
  */

  return store;
}