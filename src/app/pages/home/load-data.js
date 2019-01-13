
import MixingFeedLoadData from '@modules/mixing-feed/load-data';

export default ({ store, match, res, req, user }) => {
  return new Promise(async resolve => {
    await MixingFeedLoadData({ store, match, res, req, user });
    resolve({ code:200 });
  });
}
