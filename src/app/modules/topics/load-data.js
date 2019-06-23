
import { loadTopicList } from '@actions/topic';

export default ({ store }) => {
  return new Promise(async resolve => {

    await loadTopicList({
      id: 'recommend-topics',
      args: {
        type: "parent", recommend: true, sort_by: 'sort:-1'
      }
      // filters: { variables: { type: "parent", recommend: true, sort_by: 'sort:-1' } }
    })(store.dispatch, store.getState);
    
    resolve();
  });
}
