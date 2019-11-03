import React from 'react';

import Follow from '@app/components/follow';
import SendMessage from '@app/components/send-message';
import MoreMenu from '@app/components/more-menu';

// styles
import './styles/index.scss';

export default ({ people }: any) => {

  return (
    <div styleName="box" className="card border-bottom">

      <div styleName="cover-image" style={people.user_cover ? {backgroundImage:`url(${people.user_cover})`} : null}>

      </div>

      {/* <span styleName="menu"><MoreMenu user={people} /></span> */}
      
      <div className="card-body">

        <div>

        <div className="text-center">
          <img styleName="avatar" className='mb-2' src={people.avatar_url.replace('thumbnail/!50', 'thumbnail/!300')} />
        </div>
        
        <div styleName="content" className="text-center">

          <div styleName="nickname">
            {people.nickname}
            {Reflect.has(people, 'gender') && people.gender != null ?
              <span styleName={people.gender == 1 ? 'male' : 'female'}></span>
              : null}
          </div>

          <div styleName="brief">{people.brief}</div>

          <div className="text-muted">
            <small>注册于{people._create_at}</small>
          </div>

        </div>

        <div className="text-center mt-3">
          <Follow user={people} className="btn btn-outline-primary btn-sm rounded-pill" />
          <SendMessage people_id={people._id} className="btn btn-outline-primary btn-sm rounded-pill ml-3" />
          <MoreMenu user={people}>
            <span className="btn btn-outline-secondary btn-sm rounded-pill ml-3">
              <svg
                width="16px"
                height="16px"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                >
                <use xlinkHref="/feather-sprite.svg#more-horizontal"/>
              </svg>
            </span>
          </MoreMenu>
        </div>

        </div>

      </div>

    </div>
  )
}