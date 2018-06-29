
import graphql from '../common/graphql';

export function loadReportTypes() {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {

      let [ err, res ] = await graphql({
        api: 'fetchReportTypes',
        fields: `
          success
          data {
            id
            text
          }
        `
      });

      if (res && res.success ) {
        dispatch({ type: 'ADD_REPORT_TYPES', types: res.data })
      }

    })
  }
}

export function addReport({ data }) {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {

      let [ err, res ] = await graphql({
        type: 'mutation',
        api: 'addReport',
        args: data,
        fields: `success`,
        headers: { accessToken: getState().user.accessToken }
      });

      resolve([ err, res ]);

    })
  }
}
