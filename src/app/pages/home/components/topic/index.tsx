import React from 'react';
import { Link } from 'react-router-dom';

// layout
import TwoColumns from '@app/layout/two-columns';

// components
import ADPC from '@app/components/ads/pc';
import PostsList from '@app/components/posts-list';

// styles
import './styles/index.scss';

export default ({ topic }: any) => {

  let topic_id: any = [];

  if (topic.children && topic.children.length > 0) {
    topic.children.map((item: any)=>{
      topic_id.push(item._id)
    })
  }
  topic_id = topic_id.join(',');

  return (<TwoColumns>
    <div>
      
      <div className="card">
        <div className="card-header">

        {topic.children && topic.children.length > 0 ?
          <div styleName="child-topic">
            {topic.children.map(({ _id, name }: { _id: string, name: string })=>{
              return <Link key={_id} to={`/topic/${_id}`} className="text-dark">{name}</Link>
            })}
          </div>
          : null}

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

    <div></div>

    <div>
      <div className="card">
        <div className="card-header"><div className="card-title">最热</div></div>
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
      <ADPC width="250px" height="250px" />
    </div>

    </TwoColumns>
  )
}
