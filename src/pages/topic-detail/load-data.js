import { loadTopics } from '../../store/actions/topic';
import { loadPostsList } from '../../store/actions/posts';
/**
 * 分析url上面的参数
 * @param  {String} search location.search
 * @return {Object}        符合的参数对象
 */
const analyzeUrlParams = (search) => {

  let params = {};
  (search.split('?')[1] || '').split('&').map(item=>{
    let s = item.split('=');
    params[s[0]] = s[1];
  });

  let whiteParams = {}

  let whiteList = {
    // sort_by: (s)=>s,
    // recommend: (s)=>true,
    // deleted: (s)=>true,
    // weaken: (s)=>true,
    page_number: (s)=>parseInt(s)
    // page_size: (s)=>parseInt(s)
    // start_create_at: (s)=>s,
    // end_create_at: (s)=>s,
    // topic_id: (s)=>s,
    // user_id: (s)=>s,
    // _id: (s)=>s
  }

  for (let i in params) {
    if (whiteList[i]) whiteParams[i] = whiteList[i](params[i])
  }

  return whiteParams;
}

// 生成筛选对象
// *** 注意 ***
// 筛选参数每次都需要返回一个新对象，否则在相同页面切换的时候，筛选对象会指向同一个的问题
const generatePostsFilters = (topic, search) => {

  search = analyzeUrlParams(search);

  let childrenIds = [];

  if (topic.children) {
    topic.children.map(item=>{
      childrenIds.push(item._id);
    });
  }

  childrenIds = childrenIds.join(',');

  let query = {
    sort_by: "sort_by_date",
    deleted: false,
    weaken: false,
    page_size: 10,
    topic_id: topic.parent_id ? topic._id : childrenIds
  }

  return {
    general: {
      query: Object.assign({}, query, search)
    },
    recommend: {
      query: Object.assign({}, query, {
        sort_by: "comment_count,like_count,sort_by_date",
        page_size: 10,
        start_create_at: (new Date().getTime() - 1000 * 60 * 60 * 24 * 30) + ''
      })
    }
  }

}

// 服务端渲染
// 加载需要在服务端渲染的数据
export default ({ store, match }) => {
  return new Promise(async (resolve, reject) => {

    const { id } = match.params;
    let err, result;

    [ err, result ] = await loadTopics({
      id: id,
      filters: { variables: { _id: id } }
    })(store.dispatch, store.getState);

    if (!err && result && result.data && result.data[0]) {

      let { general, recommend } = generatePostsFilters(result.data[0], match.search);

      if (!general.query.topic_id) {
        resolve({ code:200 });
        return
      }

      Promise.all([
        new Promise(async resolve => {
          [ err, result ] = await loadPostsList({
            id: match.url + match.search,
            filters: general
          })(store.dispatch, store.getState);
          resolve([ err, result ])
        }),
        /*
        new Promise(async resolve => {

          [ err, result ] = await loadTopics({
            id: id+'-children',
            filters: { variables: { parent_id: id } }
          })(store.dispatch, store.getState);

          resolve([ err, result ]);

          // [ err, result ] = await loadPostsList({
          //   id: '_'+match.pathname,
          //   filters: recommend
          // })(store.dispatch, store.getState);
          // resolve([ err, result ])
        })
        */
      ]).then(value=>{
        resolve({ code:200 });
      });

    } else {
      resolve({ code:404, text: '该话题不存在' });
    }

  })
}
