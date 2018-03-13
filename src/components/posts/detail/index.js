import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { loadPostsList } from '../../../actions/posts'
import { getPostsById } from '../../../reducers/posts'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

import HTMLText from '../../html-text'
import AdminAction from '../admin-action'

import connectRedux from '../../../common/connect-redux'

// 纯组件
export class PostsDetail extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired
  }

  static mapStateToProps = (state, props) => {
    return {
      posts: getPostsById(state, props.id)
    }
  }
  static mapDispatchToProps = { loadPostsList }

  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    const { id, loadPostsList } = this.props
    await loadPostsList({
      name: id,
      filters: {
        variables: { _id: id }
      }
      // name: id, filters: { query: { _id: id } }
    })
  }

  render() {

    const [ posts ] = this.props.posts
    const { Meta = <div></div> } = this.props

    if (!posts) return

    return(<div>

      <Meta meta={{
        title: posts.title
      }} />

      <div styleName="posts">

        <h1 styleName="title">{posts.title}</h1>

        <div styleName="head">
          <span>
            <Link to={`/people/${posts.user_id._id}`}>
              <img styleName="author-avatar" src={posts.user_id.avatar_url} />
              <b>{posts.user_id.nickname}</b>
            </Link>
          </span>
          <span><Link to={`/posts?topic_id=${posts.topic_id._id}`}>{posts.topic_id.name}</Link></span>
          {posts.view_count ? <span>{posts.view_count} 浏览</span> : null}
          {posts.like_count ? <span>{posts.like_count} 个赞</span> : null}
          {posts.answers_count ? <span>{posts.answers_count} 个评论</span> : null}
          {posts.follow_count ? <span>{posts.follow_count} 人关注</span> : null}
          <span>{posts._create_at}</span>
        </div>

        {posts.content_html ?
          <div styleName="detail"><HTMLText content={posts.content_html} /></div>
          :null}
      </div>

      <AdminAction posts={posts} />

    </div>)
  }

}

PostsDetail = CSSModules(PostsDetail, styles)
export default connectRedux(PostsDetail)
