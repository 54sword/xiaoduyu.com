import React from 'react';
import { Link } from 'react-router-dom';
import useReactRouter from 'use-react-router';

// import { useSelector } from 'react-redux';
// import { getHasReadByPostsId } from '@app/redux/reducers/has-read-posts';

// styles
import './styles/index.scss';

type Posts = {
  _id: string
  title: string
  notice: string
  status: boolean
  user_id: {
    _id: string
    nickname: string
    avatar_url: string
  }
  _last_time?: number
  audience_count?: number
  view_count?: number
  talk_count?: number
  cover_image?: string
}

interface Props {
  data: Posts,
  key?: string | number
}

export default function({ data }: Props) {

  const stopPropagation = function(e: any) {
    e.stopPropagation();
  }

  const { history, location, match } = useReactRouter();

  const toPostsDetail = () => history.push(`/live/${data._id}`)
  

  return (<div onClick={toPostsDetail} className="col-md-4">

    <div styleName="box" className="card">

      <div styleName="cover-image" className="rounded-top" style={data.status && data.cover_image ? {backgroundImage:`url(${data.cover_image})`} : {}}>
        {!data.status ?
          <div styleName="notice">
            <h5>预告</h5>
            {data.notice}
          </div>
          : null}
      </div>

      <div styleName="main">
        
        <div styleName="title">
          <Link to={`/live/${data._id}`} onClick={stopPropagation} className="text-dark">{data.title}</Link>
        </div>

        <div styleName="sub-content" className="d-flex justify-content-between">

          <Link styleName="nickname" to={`/people/${data.user_id._id}`} onClick={stopPropagation} className="text-dark">
            <i styleName="avatar" className="load-demand" data-load-demand={encodeURIComponent(`<img src="${data.user_id.avatar_url}" />`)}></i>
            <span>{data.user_id.nickname}</span>
          </Link>

          {data.status ?
          <div styleName="active-info" className="text-secondary">

            {data.view_count ?
              <span>
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  >
                  <use xlinkHref="/feather-sprite.svg#eye" />
                </svg>
                {data.view_count}
              </span>
              : null}

            {data.talk_count ? 
              <span>
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  >
                  <use xlinkHref="/feather-sprite.svg#message-square" />
                </svg>
                {data.talk_count}
              </span>
              : null}

            {data.audience_count ? 
              <span>
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  >
                  <use xlinkHref="/feather-sprite.svg#user" />
                </svg>
                {data.audience_count}
              </span>
              : null}

          </div>
          : null}

        </div>

      </div>

    </div>

  </div>)

}