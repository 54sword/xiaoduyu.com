import React, { useEffect } from 'react';
import useReactRouter from 'use-react-router';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadTopicList } from '@app/redux/actions/topic';
import { getTopicListById } from '@app/redux/reducers/topic';

import SingleColumns from '@app/layout/single-columns';

// components
import Shell from '@app/modules/shell';
import Meta from '@app/modules/meta';
import Loading from '@app/components/ui/loading';

import NewPostsList from '@app/modules/posts-list';
import TopicCard from '@app/modules/topic-card';

/**
 * 分析url上面的参数
 * @param  {String} search location.search
 * @return {Object}        符合的参数对象
 */
/*
const analyzeUrlParams = (params) => {

  let whiteParams = {};
  let whiteList = {
    page_number: s => parseInt(s)
  }

  for (let i in params) {
    if (whiteList[i]) whiteParams[i] = whiteList[i](params[i])
  }

  return whiteParams;
}
*/

export default Shell(function({ setNotFound }: any) {

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
    <SingleColumns>

    <Meta title={topic.name} />

    <TopicCard topic={topic} />

    <div className="card mt-3">
      <div className="card-header">
        <div className="card-title">{topic.name}</div>
      </div>
      <div className="card-body p-0">
        <NewPostsList
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

    </SingleColumns> 
  )
})
