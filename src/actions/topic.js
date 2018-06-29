
import loadList from '../common/graphql-load-list';//'./common/new-load-list';

export function loadTopics({ id, filters = {}, restart = false  }) {
  return async (dispatch, getState) => {

    if (!filters.select) {
      filters.select = `
        _id
        name
        brief
        description
        avatar
        background
        follow_count
        posts_count
        comment_count
        sort
        create_at
        language
        recommend
        user_id
        follow
        parent_id {
          _id
          name
          brief
          avatar
        }
        children {
          _id
          name
          brief
          avatar
        }
      `
    }

    return loadList({
      dispatch,
      getState,

      name: id,
      restart,
      filters,

      // processList: processPostsList,
      schemaName: 'topics',
      reducerName: 'topic',
      api: '/topic',
      actionType: 'SET_TOPIC_LIST_BY_NAME'
    });
  }
}
