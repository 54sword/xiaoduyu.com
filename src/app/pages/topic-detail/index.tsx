import React, { useEffect } from 'react';
import useReactRouter from 'use-react-router';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadTopicList } from '@app/redux/actions/topic';
import { getTopicListById } from '@app/redux/reducers/topic';
// import { loadTopicList } from '@app/redux/actions/topic';
import { loadPostsList } from '@app/redux/actions/posts';

import TwoColumns from '@app/layout/two-columns';

// components
import Shell from '@app/components/shell';
import Meta from '@app/components/meta';
import Loading from '@app/components/ui/loading';

import TopicCard from './components/topic-card';
import PostsList from '@app/components/posts-list';

const topicDetail = Shell(function({ setNotFound }: any) {

  const { history, location, match } = useReactRouter();

  const list = useSelector((state: object)=>getTopicListById(state, match.params.id));
  const { data = [], loading = false } = list || {};
  const topic = data[0] || null;

  const store = useStore();
  const _loadTopics = (args: any) => loadTopicList(args)(store.dispatch, store.getState);

  useEffect(()=>{

    if (loading) return;

    const { id } = match.params;

    if (!topic) {
      _loadTopics({
        id,
        args: {
          _id: id
        }
      }).then(([err, res]: any)=>{
        if (!res || res && res.data && !res.data[0]) {
          setNotFound('话题不存在');
        }
      })
    }

  }, [match.params.id]);

  if (!topic || loading) return <div className="text-center"><Loading /></div>;

  let topic_id: any = [];

  if (topic.children && topic.children.length > 0) {
    topic.children.map((item: any)=>{
      topic_id.push(item._id)
    })
  } else {
    topic_id.push(topic._id)
  }

  topic_id = topic_id.join(',');

  return (    
    <TwoColumns>

    <div>
    <Meta title={topic.name} />
      
      <div className="card">
        {/* <div className="card-header">
          <div className="card-title">{topic.name}</div>
        </div> */}
        <div className="card-header p-4">
          <TopicCard topic={topic} />
        </div>
        
        <div className="card-body p-0">
          <PostsList
            id={topic._id}
            query={{
              sort_by: "sort_by_date:-1",
              deleted: false,
              weaken: false,
              page_size: 30,
              topic_id: topic_id
            }}
            scrollLoad={true}
            />
        </div>
      </div>
    </div>


    <div>

      <div className="card">
        <div className="card-header"><b>最热</b></div>
        <div className="card-body p-0">
        <PostsList
            id={'hot-'+topic._id}
            itemType="poor"
            query={{
              topic_id: topic_id,
              sort_by: "comment_count:-1,like_count:-1,sort_by_date:-1",
              start_create_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)+'',
              deleted: false,
              weaken: false,
              page_size: 10

            }}
            />
        </div>
      </div>

    </div>

    </TwoColumns>)
});

topicDetail.loadDataOnServer = async function({ store, match, res, req, user }: any) {

  if (user) return { code:200 };

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

    let ids = [];

    if (topic.children && topic.children.length > 0) {
      topic.children.map((item: any)=>{
        ids.push(item._id)
      })
    } else {
      ids.push(topic._id)
    }

    await loadPostsList({
      id: topic._id,
      args: {
        sort_by: "sort_by_date:-1",
        deleted: false,
        weaken: false,
        page_size: 30,
        topic_id: ids.join(','),//topic._id,
        ...searchParams
      }
    })(store.dispatch, store.getState);

    return { code:200 }

  } else {
    return { code:404, text: '该话题不存在' }
  }

}

export default topicDetail;


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