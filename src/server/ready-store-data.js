
import { loadReportTypes } from '../store/actions/report';
// import { getReportTypes } from '../store/reducers/report-types';
import { loadTopics } from '../store/actions/topic';
// import { getTopicListByKey } from '../store/reducers/topic';
import { loadUserInfo } from '../store/actions/user';

// redux 中的数据清理、以及准备一些经常不变的数据

export default (store, accessToken) => {
  return new Promise (async resolve => {

    // =======================================================
    // store的数据，如果不清空，store的数据会一直存在
    // store.dispatch({ type: 'CLEAN' });

    // =======================================================
    // 一些经常通用数据，不会经常更新的数据，在服务器获取并储存在store中

    await loadReportTypes()(store.dispatch, store.getState);
    /*
    await loadTopics({
      id: 'head',
      filters: { variables: { type: "parent", recommend: true } }
    })(store.dispatch, store.getState);
    */

    if (accessToken) {
      let res = await loadUserInfo({ accessToken })(store.dispatch, store.getState);
      resolve(res);
    } else {
      resolve([]);
    }

  });
}
