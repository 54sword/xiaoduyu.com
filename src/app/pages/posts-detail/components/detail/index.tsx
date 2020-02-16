import React from 'react';
import { Link } from 'react-router-dom';

import featureConfig from '@config/feature.config';

// style
import './styles/index.scss';

// components
import HTMLText from '@app/components/html-text';
import Like from '@app/components/like/icon';
import MoreMenu from '@app/components/more-menu';
// import Follow from '@app/components/follow';
import FollowBookmark from '@app/components/follow/bookmark';
import FollowPeople from '@app/components/follow/button';
import Share from '@app/components/share/icon';
import LikePeople from '@app/components/like-people';
// import WechatShareTips from '@app/components/wechat-share-tips';

export default function({ posts }: any) {

    return(<div className="card">

        <div className="d-block d-md-none">
        <div styleName="head" className="d-flex justify-content-between align-items-center border-bottom">

          <div className="w-50">
            <Link to={`/people/${posts.user_id._id}`} className="text-dark">
              <img styleName="author-avatar" src={posts.user_id.avatar_url} />
              <b>{posts.user_id.nickname}</b>
            </Link>
            <div styleName="brief">
              {posts.user_id.brief || "..."}
            </div>
          </div>

          <div style={{textAlign:'right'}}>
            <FollowPeople user={posts.user_id} />
          </div>

        </div>
        </div>

        <div className="card-body">

          <div styleName="header">

          {/* <img styleName="author-avatar" src={posts.user_id.avatar_url} /> */}

          {/* <div styleName="posts-other-info" className="text-secondary mb-2">



          </div> */}

            <h1 styleName="h1">{posts.title}</h1>

            <div className="text-muted mt-1" styleName="info">

              <span>
                <Link to={`/topic/${posts.topic_id.parent_id._id}`} className="text-muted">
                  {posts.topic_id.parent_id.name}
                </Link>
                <span className="text-muted mr-1 ml-1">›</span>
                <Link to={`/topic/${posts.topic_id._id}`} className="text-muted">
                  {posts.topic_id.name}
                </Link>
              </span>

              <span>创建于{posts._create_at}</span>
              {posts.view_count ? <span>{posts.view_count}次阅读</span> : null}
              {/* {posts.like_count ? <span>{posts.like_count}人赞</span> : null} */}
              {posts.follow_count ? <span>{posts.follow_count}人收藏</span> : null}
              {posts._device ? <span dangerouslySetInnerHTML={{__html:posts._device}}></span> : null}
            </div>

          </div>

        </div>

        {posts.content_html ?
          <div styleName="detail" className="card-body border-top">
            <HTMLText content={posts.content_html} maxHeight={featureConfig.posts.contentMaxHeight} />
          </div>
          :null}

        <div className="container card-footer">
          <div className="d-flex justify-content-between">
            <div styleName="like-bar">

            {/* <div className="text-muted" styleName="info">
              <span>创建于{posts._create_at}</span>
              {posts.view_count ? <span>{posts.view_count}次阅读</span> : null}
              {posts.like_count ? <span>{posts.like_count}人赞</span> : null}
              {posts.follow_count ? <span>{posts.follow_count}人收藏</span> : null}
              {posts._device ? <span dangerouslySetInnerHTML={{__html:posts._device}}></span> : null}
            </div> */}

              {/* <Like posts={posts} displayNumber={false} styleType="icon" /> */}

              <LikePeople
                id={posts._id}
                query={{
                  type: "posts",
                  target_id: posts._id,
                  page_size: 10,
                  sort_by: 'create_at:-1'
                }}
                scrollLoad={false}
                />

              {posts.like_count 
                ?
                  <span className="text-secondary">
                    有{posts.like_count}人点赞
                  </span>
                :
                <span className="text-muted ml-0">
                  暂时无人点赞
                </span>
                }

            </div>

            <div styleName="control-bar" className="text-secondary">
              {/* <svg>
                <use xlinkHref="/feather-sprite.svg#thumbs-up" />
              </svg> */}

              <Like posts={posts} />

              <FollowBookmark posts={posts} />

              {/* <svg>
                <use xlinkHref="/feather-sprite.svg#bookmark" />
              </svg> */}

              {/* <svg>
                <use xlinkHref="/feather-sprite.svg#share" />
              </svg>

              <svg>
                <use xlinkHref="/feather-sprite.svg#more-horizontal" />
              </svg> */}



              {/* <Share posts={posts}>
                <svg>
                  <use xlinkHref="/feather-sprite.svg#share" />
                </svg>
              </Share>
               */}
              <Share posts={posts} />
              <MoreMenu posts={posts} />

            </div>              

          </div>
        </div>

        {/* 
        <div className="card-footer d-flex justify-content-between">
          <div className="w-50 text-muted" styleName="info">
            <span>{posts._create_at}</span>
            {posts.view_count ? <span>{posts.view_count}次阅读</span> : null}
            {posts.like_count ? <span>{posts.like_count}人赞</span> : null}
            {posts.follow_count ? <span>{posts.follow_count}人收藏</span> : null}
            {posts._device ? <span dangerouslySetInnerHTML={{__html:posts._device}}></span> : null}
          </div>
          <div styleName="actions">
            <Like posts={posts} displayNumber={false} />
            <Follow posts={posts} className="a text-secondary" activeClassName="a text-secondary" />
            <Share posts={posts} />
            <MoreMenu posts={posts} />
          </div>
        </div>
        */}

    </div>)

}
