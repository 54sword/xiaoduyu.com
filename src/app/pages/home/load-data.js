
import MixingFeedLoadData from '@modules/mixing-feed/load-data';
import TopicsLoadData from '@modules/topics/load-data';

export default ({ store, match, res, req, user }) => {
  return new Promise(async resolve => {

    Promise.all([
      MixingFeedLoadData({ store, match, res, req, user }),
      TopicsLoadData({ store, match, res, req, user })
    ]).then(res=>{
      resolve({ code:200 });
    }).catch(err=>{
      resolve({ code:200 });
    });

  });
}
