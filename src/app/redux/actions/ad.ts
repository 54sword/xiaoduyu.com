import graphql from '../../common/graphql';

import loadList from '../../common/new-graphql-load-list';

export const loadADlist = loadList({
  reducerName: 'ad',
  actionType: 'SET_AD_LIST_BY_ID',
  api: 'ads',
  fields: `
    pc_img
    pc_url
    app_img
    app_url
    deleted
    block_date
    close
  `
});

export const addAD = function(args: any) {
  return (dispatch: any, getState: any) => {
  return new Promise(async (resolve, reject) => {

    let [ err, res ] = await graphql({
      type: 'mutation',
      apis: [{
        api: 'addAD',
        args: JSON.parse(JSON.stringify(args)),
        fields: `success`
      }],
      headers: { accessToken: getState().user.accessToken }
    });

    err ? reject(err) : resolve(res);

  })
  }
}

export const updateAD = function(args: any) {
  return (dispatch: any, getState: any) => {
  return new Promise(async (resolve, reject) => {

    let [ err, res ] = await graphql({
      type: 'mutation',
      apis: [{
        api: 'updateAD',
        args: JSON.parse(JSON.stringify(args)),
        fields: `success`
      }],
      headers: { accessToken: getState().user.accessToken }
    });

    err ? reject(err) : resolve(res);

  })
  }
}