
import MixingFeedLoadData from '@modules/mixing-feed/load-data';
import TopicsLoadData from '@modules/topics/load-data';

import { loadPostsList } from '@actions/posts';

export default ({ store, match, res, req, user }) => {
  return new Promise(async resolve => {

    Promise.all([
      new Promise(async resolve => {

        if (user) {
          resolve();
          return;
        }

        await loadPostsList({
          id:'home',
          filters: {
            variables: {
              sort_by: "sort_by_date",
              deleted: false,
              weaken: false
            }
          }
        })(store.dispatch, store.getState);

        resolve();

      }),
      // MixingFeedLoadData({ store, match, res, req, user }),
      TopicsLoadData({ store, match, res, req, user })
    ]).then(res=>{
      resolve({ code:200 });
    }).catch(err=>{
      resolve({ code:200 });
    });

  });
}
