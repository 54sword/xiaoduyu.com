
import graphql from './common/graphql';
import loadList from './common/new-load-list';

export const loadBlockList = ({ id, args, select, restart }) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      let filters = {
        variables: args
      }

      if (!select) {
        filters.select = `
          _id
          deleted
          create_at
          ip
          user_id
          comment_id {
            _id
            content_html
            posts_id
            parent_id
          }
          people_id {
            create_at
            avatar
            _id
            nickname
            avatar_url
            id
          }
          posts_id {
            title
            _id
          }
        `
      }

      return loadList({
        dispatch,
        getState,

        name: id,
        restart,
        filters,

        schemaName: 'blocks',
        reducerName: 'block',
        api: '/blocks',
        actionType: 'SET_BLOCK_LIST_BY_NAME'
      })

    })
  }
}

export const addBlock = ({ args }) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        type: 'mutation',
        api: 'addBlock',
        args,
        fields: `
          success
        `,
        headers: {
          accessToken: getState().user.accessToken
        }
      });

      resolve([err, res]);

    })
  }
}
