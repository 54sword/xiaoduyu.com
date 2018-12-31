
import loadList from '../../common/graphql-load-list';//'./common/new-load-list';

let lastCacheTime = new Date().getTime();

export function loadTopics({ id, filters = {}, restart = false  }) {
  return (dispatch, getState) => {
    // return new Promise(async (resolve, reject) => {

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
      

      // let cache = true;
      let api = 'topics', type = 'query';

      // if (new Date().getTime() - lastCacheTime > 1000 * 60) {
      //   // cache = false;
      //   lastCacheTime = parseInt(new Date().getTime());
      //   api = 'upvoteTopics';
      //   type = 'mutation';
      //   console.log('不缓存');
      // } else {
      //   console.log('缓存');
      // }

      return loadList({
        // type,
        dispatch,
        getState,
        name: id,
        restart,
        filters,
        // cache: true,
        schemaName: 'topics',
        reducerName: 'topic',
        api,
        actionType: 'SET_TOPIC_LIST_BY_NAME'
        // cache: true
      });

      // resolve();

    // });

  }
}
