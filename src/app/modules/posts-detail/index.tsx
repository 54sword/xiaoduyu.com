import React from 'react';
import { Link } from 'react-router-dom';

// style
import './index.scss';

// components
import HTMLText from '@components/html-text';
import Like from '@components/like';
import MoreMenu from '@components/more-menu';
import Follow from '@components/follow';
import Share from '@components/share';


export default function({ posts }: any) {

    return(<div className="card">
        
        <div styleName="head" className="d-flex justify-content-between align-items-center border-bottom">

          <div>
            <Link to={`/people/${posts.user_id._id}`}>
              <img styleName="author-avatar" src={posts.user_id.avatar_url} />
              <b>{posts.user_id.nickname}</b>
            </Link>
            <span className="text-secondary ml-2">
              {posts.user_id.brief || "这家伙很懒，什么个性签名都没有留下。"}
            </span>
          </div>

          <div>
            <button className="btn btn-outline-primary btn-sm">关注</button>
          </div>

        </div>

        <div className="card-body border-bottom pt-3 pb-3">
{/* 
          <span>
            {posts.topic_id && posts.topic_id.parent_id && posts.topic_id.parent_id._id ?
              <>
              <Link to={`/topic/${posts.topic_id.parent_id._id}`} className="text-secondary">
                {posts.topic_id.parent_id.name}
              </Link>
              <span className="text-muted mr-2 ml-2">/</span>
              </>
              : null}
            <Link to={`/topic/${posts.topic_id._id}`} className="text-secondary">
              {posts.topic_id.name}
            </Link>
          </span> */}

          <h1 styleName="h1">{posts.title}</h1>


            <div styleName="posts-other-info" className="text-secondary">

              <span>
                <Link to={`/topic/${posts.topic_id.parent_id._id}`} className="text-secondary">
                  {posts.topic_id.parent_id.name}
                </Link>
                <span className="text-muted mr-1 ml-1">›</span>
                <Link to={`/topic/${posts.topic_id._id}`} className="text-secondary">
                  {posts.topic_id.name}
                </Link>
              </span>

              <span>{posts._create_at}</span>  
              
              {posts._device ? <span>{posts._device}</span> : null}

              {posts.view_count ? <span>{posts.view_count}次阅读</span> : null}
              {posts.like_count ? <span>{posts.like_count}人赞</span> : null}
              {/* {posts.comment_count ? <span>{posts.comment_count}条评论</span> : null} */}
              {/* {posts.reply_count ? <span>{posts.reply_count}条回复</span> : null} */}
              {posts.follow_count ? <span>{posts.follow_count}人收藏</span> : null}


          </div>





          {/* <div className="d-flex justify-content-between">
            <div styleName="actions">
              
              <span className="text-secondary">{posts._create_at}</span>
              {posts.view_count ? <span className="text-secondary">{posts.view_count}次阅读</span> : null}
              {posts.like_count ? <span className="text-secondary">{posts.like_count}人赞</span> : null}
              {posts.comment_count ? <span className="text-secondary">{posts.comment_count}条评论</span> : null}
              {posts.reply_count ? <span className="text-secondary">{posts.reply_count}条回复</span> : null}
              {posts.follow_count ? <span className="text-secondary">{posts.follow_count}人收藏</span> : null}
            </div>
            <div styleName="actions">

            </div>
          </div> */}

          {/* 
        <div className="d-flex justify-content-start">

          
          <div>
            <Link to={`/people/${posts.user_id._id}`}>
              <img styleName="author-avatar" src={posts.user_id.avatar_url} />
            </Link>
          </div>

          <div>
            
            <div>
              <Link to={`/people/${posts.user_id._id}`}>
                {posts.user_id.nickname}
              </Link>

              <span className="ml-2 text-secondary">{posts._create_at}</span>
            </div>

            <h1 styleName="h1">{posts.title}</h1>
            
          </div>

        </div>
        */}
        </div>




        {posts.content_html ?
          <div className="card-body border-bottom">
          <div styleName="detail">
            <HTMLText content={posts.content_html} />
          </div>
          </div>:null}
        
        

        {/* 
        <div className="d-flex justify-content-between">

          <div styleName="actions">
            {posts.view_count ? <span className="text-secondary">{posts.view_count} 次阅读</span> : null}
            {posts.comment_count ? <span className="text-secondary">{posts.comment_count} 条评论</span> : null}
            {posts.reply_count ? <span className="text-secondary">{posts.reply_count} 条回复</span> : null}
            {posts.like_count ? <span className="text-secondary">{posts.like_count} 人赞</span> : null}
            {posts.follow_count ? <span className="text-secondary">{posts.follow_count} 人订阅</span> : null}
          </div>

          <div styleName="actions" className="d-none d-lg-block d-xl-block">
            <Like posts={posts} displayNumber={false} />
            <Follow posts={posts} />
            <MoreMenu posts={posts} />
          </div>
          
        </div>
        */}
        
        {/* <div styleName="actions" className="d-block d-lg-none d-xl-none border-top" style={{marginTop:'10px', paddingTop:'10px'}}>
          <Like posts={posts} displayNumber={false} />
          <Follow posts={posts} />
          <MoreMenu posts={posts} />
        </div> */}

        


        <div className="card-footer">
          <div >
            <Like posts={posts} displayNumber={false} />
            <Follow posts={posts} />
            <Share posts={posts} />
            <MoreMenu posts={posts} />
          </div>
        </div>


    </div>)

}
