
let initialState = []

export default function countries(state = initialState, action = {}) {

  switch (action.type) {

    case 'SET_COUNTRIES':
      state = action.countries
      return state

    default:
      return state
  }

}

export function getCountries(state) {
  return state.countries
}
