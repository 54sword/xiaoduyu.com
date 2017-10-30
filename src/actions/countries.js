import Ajax from '../common/ajax'

export function fetchCountries({ callback = ()=>{} }) {
  return (dispatch, getState) => {
    return Ajax({
      url:'/countries',
      callback: (result) => {
        if (result && result.success) {
          dispatch({ type: 'SET_COUNTRIES', countries: result.data })
        }
        callback(result)
      }
    })
  }
}
