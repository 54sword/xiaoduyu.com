import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { createLogger } from 'redux-logger';

let middleware = [ thunk ];

// 如果是在客户端环境，并且是开发模式，那么打印redux日志
if (!process.env.__NODE__ && __DEV__) middleware.push(createLogger());

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
    )
  )
  return store;
}
