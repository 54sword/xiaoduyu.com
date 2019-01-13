
import loadList from '@utils/graphql-load-list';

export function loadTopics({ id, filters = {}, restart = false  }) {
  return (dispatch, getState) => {
    
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
      
      let api = 'topics', type = 'query';

      return loadList({
        dispatch,
        getState,
        name: id,
        restart,
        filters,
        schemaName: 'topics',
        reducerName: 'topic',
        api,
        actionType: 'SET_TOPIC_LIST_BY_ID'
      });

  }
}
