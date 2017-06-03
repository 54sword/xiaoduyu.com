
let initialState = {
  show: false
}

export default function sign(state = initialState, action = {}) {

  switch (action.type) {

    case 'SHOW_SIGN':
      return Object.assign({}, state, {
        show: true
      })

    case 'HIDE_SIGN':
      return Object.assign({}, state, {
        show: false
      })

    default:
      return state
  }

}

export function getSignStatus(state) {
  return state.sign.show
}
