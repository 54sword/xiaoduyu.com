import React from 'react';

import Follow from '@app/components/follow';
import SendMessage from '@app/components/send-message';
import MoreMenu from '@app/components/more-menu';

// styles
import './styles/index.scss';

export default ({ people }: any) => {

  return (
    <div styleName="box" className="card">

      <span styleName="menu"><MoreMenu user={people} /></span>

      <div className="card-body text-center">
      

          {/* <div styleName="actions">
            <SendMessage people_id={people._id} className="btn btn-outline-primary btn-sm rounded-pill mr-3" />
            <Follow user={people} />
            <span className="ml-3"><MoreMenu user={people} /></span>
          </div> */}

          

          <img styleName="avatar" className='mb-2' src={people.avatar_url.replace('thumbnail/!50', 'thumbnail/!300')} />

          <div styleName="nickname">
            {people.nickname}
            {Reflect.has(people, 'gender') && people.gender != null ?
              <span styleName={people.gender == 1 ? 'male' : 'female'}></span>
              : null}
          </div>

          <div styleName="brief">{people.brief}</div>
          {/* <div>
            <small className="text-secondary mr-2">加入于 {people._create_at}</small>
          </div> */}

          <div styleName="other-info" className="text-muted">
            {people.fans_count ? <span>{people.fans_count} 粉丝</span> : ''}
            {people.posts_count ? <span>{people.posts_count} 帖子</span> : ''}
            {people.follow_people_count ? <span>{people.follow_people_count} 关注</span> : ''}
            {people.follow_posts_count ? <span>{people.follow_posts_count} 收藏</span> : ''}
            {people.follow_topic_count ? <span>{people.follow_topic_count} 话题</span> : ''}
          </div>

          <div className="mt-3 mb-2">
            <Follow user={people} />
            <SendMessage people_id={people._id} className="btn btn-outline-primary btn-sm rounded-pill ml-3" />
          </div>

      </div>

    </div>
  )
}