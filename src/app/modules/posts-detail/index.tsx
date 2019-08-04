import React from 'react';
import { Link } from 'react-router-dom';

// style
import './styles/index.scss';

// components
import HTMLText from '@app/components/html-text';
import Like from '@app/components/like';
import MoreMenu from '@app/components/more-menu';
import Follow from '@app/components/follow';
import Share from '@app/components/share';


export default function({ posts }: any) {

    return(<div className="card" styleName="box">
        
        {/* <div styleName="head" className="d-flex justify-content-between">

          <div styleName="author">
            <Link to={`/people/${posts.user_id._id}`}>
              <img styleName="author-avatar" src={posts.user_id.avatar_url} />
              <b>{posts.user_id.nickname}</b>
            </Link>
            <div>
                {posts.user_id.brief || ""}
            </div>
          </div>

          <div style={{minWidth:'60px',textAlign:'right'}}>
            <Follow user={posts.user_id} />
          </div>

        </div> */}

        <div className="card-body">


        <div className="mb-2">
                <Link to={`/topic/${posts.topic_id.parent_id._id}`} className="text-secondary">
                  {posts.topic_id.parent_id.name}
                </Link>
                <span className="text-muted mr-1 ml-1">›</span>
                <Link to={`/topic/${posts.topic_id._id}`} className="text-secondary">
                  {posts.topic_id.name}
                </Link>
              </div>

          <div styleName="header">

          <img styleName="author-avatar" src={posts.user_id.avatar_url} />

            <h1 styleName="h1">{posts.title}</h1>

              <div styleName="posts-other-info" className="text-secondary">

                <span>
                  {posts.user_id.nickname}
                </span>

                <span>{posts._create_at}</span>  
                
                {posts._device ? <span>{posts._device}</span> : null}

                {posts.view_count ? <span>{posts.view_count}次阅读</span> : null}
                {posts.like_count ? <span>{posts.like_count}人赞</span> : null}
                {posts.follow_count ? <span>{posts.follow_count}人收藏</span> : null}
            </div>

          </div>

        </div>

        {posts.content_html ?
          <div className="card">
            <div styleName="detail" className="card-body pt-0">
              <div className="border-top mb-3"></div>
              <HTMLText content={posts.content_html} />
            </div>
          </div>
          :null}

        {/* <div className="card-footer" styleName="actions">
          <Like posts={posts} displayNumber={false} />
          <Follow posts={posts} />
          <Share posts={posts} />
          <MoreMenu posts={posts} />
        </div> */}


    </div>)

}
