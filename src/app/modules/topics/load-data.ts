
import { loadTopicList } from '@app/redux/actions/topic';

export default ({ store }: { store: any }) => {
  return new Promise(async resolve => {

    await loadTopicList({
      id: 'recommend-topics',
      args: {
        type: "parent",
        // recommend: true,
        sort_by: 'sort:-1'
      }
      // filters: { variables: { type: "parent", recommend: true, sort_by: 'sort:-1' } }
    })(store.dispatch, store.getState);
    
    resolve();
  });
}
