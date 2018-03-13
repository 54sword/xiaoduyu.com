import grapgQLClient from '../common/grapgql-client'

export const loadCountries = ()=>{
  return async (dispatch, getState) => {

    let [ err, res ] = await grapgQLClient({
      query:`
        {
          countries{
            code
            name
            abbr
          }
        }
      `
    })

    if (!err) {
      dispatch({ type: 'SET_COUNTRIES', countries: res.data.countries })
    }

  }
}


/*
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
*/
