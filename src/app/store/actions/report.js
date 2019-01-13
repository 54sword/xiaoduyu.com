
import graphql from '@utils/graphql';

export function loadReportTypes() {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {

      let [ err, res ] = await graphql({
        apis: [{
          api: 'fetchReportTypes',
          fields: `
            success
            data {
              id
              text
            }
          `
        }]
      });

      if (res) dispatch({ type: 'ADD_REPORT_TYPES', types: res.data });

      resolve();

    })
  }
}

export function addReport({ data }) {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {

      let [ err, res ] = await graphql({
        type: 'mutation',
        headers: { accessToken: getState().user.accessToken },
        apis: [{
          api: 'addReport',
          args: data,
          fields: `success`
        }]
      });

      resolve([ err, res ]);

    })
  }
}
