import React from 'react'
// import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// redux
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember } from '@reducers/user';

// style
import './index.scss';

// components
import HTMLText from '@components/html-text';
import Like from '@components/like';
import MoreMenu from '@components/more-menu';
import Follow from '@components/follow';
import Share from '@components/share';

@connect(
  (state, props) => ({
    isMember: isMember(state)
  }),
  dispatch => ({
  })
)
export default class PostsDetail extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {

    const { posts, isMember } = this.props;

    return(<div className="card">
        

        
        
        <div className="card-header pt-3 pb-3">

          <div styleName="head">

            <Link to={`/people/${posts.user_id._id}`}>
              <img styleName="author-avatar" src={posts.user_id.avatar_url} />
              <b>{posts.user_id.nickname}</b>
            </Link>

            <div className="mt-1">
              <span>{posts._create_at}</span>
              {posts._device ? <span>{posts._device}</span> : null}
            </div>

          </div>

          <h1 styleName="h1">{posts.title}</h1>

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

        <div className="card-body">

        

        {posts.content_html ?
          <div styleName="detail">
            <HTMLText content={posts.content_html} hiddenHalf={!isMember && posts.recommend ? true : false} />
          </div>
          :null}
        
        {/* <Share posts={posts} styleType="icons" /> */}

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
        
        <div styleName="actions" className="d-block d-lg-none d-xl-none border-top" style={{marginTop:'10px', paddingTop:'10px'}}>
          <Like posts={posts} displayNumber={false} />
          <Follow posts={posts} />
          <MoreMenu posts={posts} />
        </div>

        </div>


    </div>)
  }

}
