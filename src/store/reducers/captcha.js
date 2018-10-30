import merge from 'lodash/merge'

export default function() {

  let initialState = {}

  return function captcha(state = initialState, action = {}) {
    switch (action.type) {

      case 'ADD_CAPRCHA_ID':
        var { id, data } = action
        state[id] = data
        return merge({}, state, {})

      // 清空
      case 'CLEAN':
        return {}

      default:
        return state;
    }
  }

}

export const getCaptchaById = (state, id) => {
  return state.captcha[id] ? state.captcha[id] : null
}
