
let _store;

function setStore(store) {
  _store = store;
}

function handleAction(actionFn, params) {
  return actionFn(params)(_store.dispatch, _store.getState);
}
