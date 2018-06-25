import grapgQLClient from '../common/grapgql-client'

export function loadSummary({ name, filters = {} }) {
  return async (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    let variables = []

    for (let i in filters) {

      let v = ''

      switch (typeof filters[i]) {
        case 'string':
          v = '"'+filters[i]+'"'
          break
        case 'number':
          v = filters[i]
          break
        default:
          v = filters[i]
          break
      }

      variables.push(i+':'+v)
    }

    if (variables.length > 0) {
      variables = `(${variables})`
    } else {
      variables = ''
    }

    let sql = `
      {
        countPosts${variables}{
          count
        }
        countUsers${variables}{
          count
        }
        countComments${variables}{
          count
        }
        countUserNotifications${variables}{
          count
        }
        countNotifications${variables}{
          count
        }

      }
    `

    let [ err, res ] = await grapgQLClient({
      query:sql,
      headers: accessToken ? { 'AccessToken': accessToken } : null
    })

    if (err) return

    dispatch({
      type: 'SET_ANALYSIS_LIST_BY_NAME',
      name,
      data: res.data
    });

  }
}
