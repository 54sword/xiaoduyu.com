import merge from 'lodash/merge'


let initialState = {
}

export default function captcha(state = initialState, action = {}) {
  switch (action.type) {

    case 'ADD_CAPRCHA_ID':
      var { id, data } = action
      state[id] = data
      return merge({}, state, {})

    default:
      return state;
  }
}

export const getCaptchaById = (state, id) => {
  return state.captcha[id] ? state.captcha[id] : null
}
