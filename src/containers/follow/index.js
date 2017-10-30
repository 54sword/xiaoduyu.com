import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { reactLocalStorage } from 'reactjs-localstorage'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { loadPostsList, showNewPosts } from '../../actions/posts'
import { getPostsListByName } from '../../reducers/posts'
import { getProfile } from '../../reducers/user'
import { showSign } from '../../actions/sign'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

// 外壳
import Shell from '../../shell'

// 依赖组件
import Nav from '../../components/nav'
import Meta from '../../components/meta'
import PostsList from '../../components/posts-list'
import Footer from '../../components/footer'
import PublishButton from '../../components/publish-button'

let defaultProps = {
  filters: {
    weaken: 1,
    include_comments: 1,
    comments_sort: 'like_count:-1,reply_count:-1'
    // method: 'user_custom'
  },
  name: 'home'
}

// 纯组件
export class Follow extends React.Component {
  
  constructor(props) {
    super(props)

    const { filters, name } = defaultProps

    this.state = {
      name: name,
      filters: filters,
      // 评论排序偏好id
      commentsSortId: 2,
      // 评论排序数组
      commentsSort: [
        // { id: 1, condition: '', name: '不显示' },
        { id: 2, condition: 'create_at:-1', name: '最新' },
        { id: 3, condition: 'reply_count:-1,like_count:-1,create_at:-1', name: '回复最多' },
        { id: 4, condition: 'like_count:-1,reply_count:-1,create_at:-1', name: '点赞最多' }
      ]
    }
  }



  render() {

    let { name, filters, timestamp, commentsSort, commentsSortId } = this.state
    const { me, newPostsList, showNewPosts, showSign } = this.props

    const { tab = '' } = this.props.location.query

      filters.method = 'user_custom'
      filters.device = 'ios'

    return(<div>
      <Meta meta={{title: '关注'}} />
      <Nav />

      <div className="container">
          <PostsList
            name='follow'
            displayDate={false}
            displayFollow={true}
            filters={filters}
            commentOption={{
              displayReply: false,
              displayDate: false,
              summary: true,
              displayLike: false,
              displayEdit: false
            }}
            />
        </div>

        {/*<Footer />*/}

    </div>)
  }

}


Follow = CSSModules(Follow, styles)

Follow.defaultProps = defaultProps

Follow.propTypes = {
}

const mapStateToProps = (state, props) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

Follow = connect(mapStateToProps,mapDispatchToProps)(Follow)

export default Shell(Follow)
