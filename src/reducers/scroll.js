
let initialState = {}

export default function scroll(state = initialState, action = {}) {

  switch (action.type) {

    case 'SAVE_SCROLL_POSITION':
      state[action.name] = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      return state

    case 'SET_SCROLL_POSITION':
      window.scrollTo(0, state[action.name] || 0)
      return state

    default:
      return state
  }

}
