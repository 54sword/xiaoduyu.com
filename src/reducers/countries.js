import merge from 'lodash/merge'
let initialState = {
  data: []
}

export default function countries(state = initialState, action = {}) {

  switch (action.type) {

    case 'SET_COUNTRIES':
      state.data = action.countries
      return merge({}, state, {})

    default:
      return state
  }

}

export function getCountries(state) {
  return state.countries.data
}
