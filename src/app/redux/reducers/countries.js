import merge from 'lodash/merge'

export default function() {

  let initialState = {
    data: []
  }

  return function countries(state = initialState, action = {}) {

    switch (action.type) {

      case 'SET_COUNTRIES':
        state.data = action.countries
        return merge({}, state, {})

      default:
        return state
    }

  }

}

export function getCountries(state) {
  return state.countries.data
}
