import { loadTopicList } from '@app/redux/actions/topic';
import { loadPostsList } from '@app/redux/actions/posts';
/**
 * 分析url上面的参数
 * @param  {String} search location.search
 * @return {Object}        符合的参数对象
 */
const analyzeUrlParams = (search: string) => {

  let params: any = {};
  (search.split('?')[1] || '').split('&').map(item=>{
    let s = item.split('=');
    params[s[0]] = s[1];
  });

  let whiteParams: any = {}

  let whiteList: any = {
    // sort_by: (s)=>s,
    // recommend: (s)=>true,
    // deleted: (s)=>true,
    // weaken: (s)=>true,
    page_number: (s: string)=>parseInt(s)
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

// 服务端渲染
// 加载需要在服务端渲染的数据
export default ({ store, match, user }: any) => {
  return new Promise(async (resolve, reject) => {

    if (user) {
      resolve({ code:200 });
      return;
    }

    const { id } = match.params;
    let err, topic;
    
    [ err, topic ] = await loadTopicList({
      id,
      args: {
        _id: id
      }
    })(store.dispatch, store.getState);

    
    if (!err && topic && topic.data && topic.data[0]) {
      
      topic = topic.data[0];

      let searchParams = analyzeUrlParams(match.search);

      await loadPostsList({
        id: topic._id,
        args: {
          sort_by: "sort_by_date:-1",
          deleted: false,
          weaken: false,
          page_size: 30,
          topic_id: topic._id,
          ...searchParams
        }
      })(store.dispatch, store.getState);

      resolve({ code:200 });

    } else {
      resolve({ code:404, text: '该话题不存在' });
    }

  })
}
