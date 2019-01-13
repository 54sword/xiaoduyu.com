import { loadPostsList } from '@actions/posts';
import { loadFeedList } from '@actions/feed';
import { getTopicListById } from '@reducers/topic';

export default ({ store, match, res, req, user }) => {
  return new Promise(async resolve => {

    let topicList = getTopicListById(store.getState(), 'recommend-topics'),
        topicId = req.cookies['topic_id'] || '',
        ids = [],
        filters = {
          variables: {
            sort_by: "sort_by_date",
            deleted: false,
            weaken: false
          }
        };

    if (topicId) {
      topicList.data.map(item=>{
        item.children.map(i=>{
          if (item._id == topicId || i._id == topicId) {
            ids.push(i._id);
          }
        });
      });
      if (ids.length > 0) {
        filters.variables.topic_id = ids.join(',');
      }
    }

    if (topicId != 'follow' && topicId != 'excellent' && topicId != 'subscribe' && ids.length == 0 ||
        topicId == 'follow' && !user ||
        topicId == 'subscribe' && !user
    ) {
      topicId = '';
      res.clearCookie('topic_id');
    }

    if (topicId == 'excellent') {
      filters = {
        variables: {
          sort_by: "sort_by_date",
          deleted: false,
          weaken: false,
          recommend: true
        }
      }
    }

    if (topicId == 'subscribe') {
      filters = {
        variables: {
          method: 'subscribe',
          sort_by: "last_comment_at:-1",
          deleted: false,
          weaken: false
        }
      }
    }

    if (topicId == 'follow') {
      await loadFeedList({
        id: 'follow',
        filters:{
          variables: {
            preference: true,
            sort_by: "create_at:-1"
          }
        }
      })(store.dispatch, store.getState);
    } else {
      await loadPostsList({
        id: topicId || 'home',
        filters
      })(store.dispatch, store.getState);
    }

    store.dispatch({ type:'SET_TOPIC_ID', topicId });

    resolve();

  });
}
