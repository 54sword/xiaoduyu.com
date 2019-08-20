
import { loadTopicList } from '@app/redux/actions/topic';

export default ({ store }: { store: any }) => {
  return new Promise(async resolve => {

    await loadTopicList({
      id: 'home-topics',
      args: {
        type: "not-parent",
        sort_by: 'follow_count:-1,posts_count:-1,sort:-1',
        page_size: 16
      }
    })(store.dispatch, store.getState);
    
    resolve();
  });
}
