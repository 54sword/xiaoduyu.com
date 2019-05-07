import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { createLogger } from 'redux-logger';

// import subscribe from './subscribe';

let middleware = [ thunk ];

// 如果是在客户端环境，并且是开发模式，那么打印redux日志
if (process.env.NODE_ENV == 'development' && typeof __SERVER__ == 'undefined' ||
  process.env.NODE_ENV == 'development' && typeof __SERVER__ != 'undefined' && !__SERVER__
) {
  middleware.push(createLogger());
}

export default function configureStore(initialState = {}) {

  const store = createStore(
    rootReducer(),
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
  
  // react native 需要订阅redux更新
  // store.subscribe(subscribe(store));

  return store;
}
