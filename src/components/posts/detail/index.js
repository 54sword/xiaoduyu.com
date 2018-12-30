import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPostsList } from '../../../store/actions/posts';
import { getPostsById } from '../../../store/reducers/posts';
import { isMember } from '../../../store/reducers/user';

// style
import './style.scss'

// components
import HTMLText from '../../html-text';
// import AdminAction from '../admin-action';
// import Follow from '../../follow';
import Like from '../../like';
import EditButton from '../../edit-button';
import ReportMenu from '../../report-menu';

import Follow from '@components/follow';

import Share from '../../share';


// import connectRedux from '../../../common/connect-redux'


@connect(
  (state, props) => ({
    posts: getPostsById(state, props.id),
    isMember: isMember(state)
  }),
  dispatch => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch)
  })
)
export default class PostsDetail extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const { id, loadPostsList } = this.props;

    loadPostsList({
      id,
      filters: {
        variables: { _id: id }
      }
    })
  }

  componentWillReceiveProps(props) {

    if (props.id != this.props.id) {
      this.props = props;
      this.componentDidMount();
    }
  }

  render() {

    const { posts, isMember } = this.props

    if (!posts) return <div>loading...</div>

    return(<div styleName="box">
        
        <div styleName="head">
          
          <Link to={`/people/${posts.user_id._id}`}>
            <img styleName="author-avatar" src={posts.user_id.avatar_url} />
            <b>{posts.user_id.nickname}</b>
          </Link>

          {/* <div styleName="menu"><ReportMenu /></div> */}

          <div>
            {/* <span><Link to={`/topic/${posts.topic_id._id}`}>{posts.topic_id.name}</Link></span> */}
            {/* {posts.view_count ? <span>{posts.view_count} 浏览</span> : null} */}
            {/* {posts.like_count ? <span>{posts.like_count} 个赞</span> : null} */}
            {/* {posts.answers_count ? <span>{posts.answers_count} 个评论</span> : null} */}
            {/* {posts.follow_count ? <span>{posts.follow_count} 人关注</span> : null} */}
            <span>{posts._create_at}</span>
          </div>

          {/* <Follow user={posts.user_id} /> */}

        </div>

        <h1 styleName="h1">{posts.title}</h1>

        {posts.content_html ?
          <div styleName="detail"><HTMLText content={posts.content_html} hiddenHalf={!isMember && posts.recommend ? true : false} /></div>
          :null}


        <div className="d-flex justify-content-between">

          <div styleName="actions">
            {posts.view_count ? <span>{posts.view_count} 次阅读</span> : null}
            {posts.comment_count ? <span>{posts.comment_count} 条评论</span> : null}
            {posts.reply_count ? <span>{posts.reply_count} 条回复</span> : null}
            {posts.like_count ? <span>{posts.like_count} 人赞</span> : null}
            {posts.follow_count ? <span>{posts.follow_count} 人订阅</span> : null}
          </div>

          <div styleName="actions">
            <Like posts={posts} displayNumber={false} />
            <Follow posts={posts} />
            <Share posts={posts} />
            {/* <EditButton posts={posts} /> */}
            <ReportMenu />
          </div>

        </div>






      {/* <AdminAction posts={posts} /> */}

    </div>)
  }

}
