import React from 'react';
import PropTypes from 'prop-types';

import Follow from '@components/follow';

export default class TopicCard extends React.PureComponent {

  static propTypes = {
    topic: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      brief: PropTypes.string.isRequired,
      posts_count: PropTypes.number.isRequired,
      follow_count: PropTypes.number.isRequired,
      comment_count: PropTypes.number.isRequired,
      follow: PropTypes.bool
    })
  }
  
  constructor(props) {
    super(props);
  }
  
  render() {

    const { topic } = this.props; 

    return (<div className="card-body rounded" style={{backgroundColor:'#fff',marginBottom:'10px'}}>
      <div className="media">
        <img src={topic.avatar} className="align-self-start mr-3 rounded" width="80" height="80" alt={topic.name} />
        <div className="media-body">
          {topic.parent_id ?
            <div style={{float:'right'}}><Follow topic={topic} /></div>
            : null}
          <h5 className="mt-0">{topic.name}</h5>
          <div>{topic.brief}</div>
          <div className="text-secondary mt-1">
            {topic.posts_count ? <span className="mr-3">{topic.posts_count} 帖子</span> : null}
            {topic.follow_count ? <span className="mr-3">{topic.follow_count} 关注</span> : null}
            {topic.comment_count ? <span className="mr-3">{topic.comment_count} 评论</span> : null}
          </div>
        </div>
      </div>
    </div>)
  }

}
