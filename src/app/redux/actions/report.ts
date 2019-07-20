import graphql from '../../common/graphql';

export function loadReportTypes() {
  return (dispatch: any, getState: any) => {
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
        }],
        cache: true
      });

      if (res) dispatch({ type: 'ADD_REPORT_TYPES', types: res.data });

      resolve();

    })
  }
}

export function addReport({ data }: { data: any }) {
  return (dispatch: any, getState: any) => {
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
