import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { reactLocalStorage } from 'reactjs-localstorage'

// 外壳
import Shell from '../../shell'

// 依赖组件
import Nav from '../../components/nav'
import Meta from '../../components/meta'
import PostsList from '../../components/posts-list'

// actions
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { loadPostsList } from '../../actions/posts'
import { getPostsListByName } from '../../reducers/posts'
import { getProfile } from '../../reducers/user'

// 纯组件
export class Home extends React.Component {

  // 服务器预加载内容
  static loadData(option, callback) {
    if (option.userinfo) {
      callback()
    } else {
      option.store.dispatch(loadPostsList({ name:'home', callback:()=>{
        callback()
      }}))
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      name: 'home',
      filters: {
        method:'user_custom',
      },
      // 评论排序偏好id
      commentsSortId: 1,
      // 评论排序数组
      commentsSort: [
        { id: 1, condition: '', name: '不显示' },
        { id: 2, condition: 'create_at:-1', name: '最新' },
        { id: 3, condition: 'reply_count:-1,like_count:-1,create_at:-1', name: '回复最多' },
        { id: 4, condition: 'like_count:-1,reply_count:-1,create_at:-1', name: '点赞最多' }
      ]
    }

    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    const { me } = this.props
    if (me._id) {
      const consition = reactLocalStorage.get('comments_sort_id') || 1
      this.onChange(consition)
    }
  }

  onChange(id) {

    const { name, filters, commentsSort } = this.state
    const { postsList } = this.props

    let condition = ''
    let commentsSortId = 1

    commentsSort.map(item=>{
      if (item.id == id) {
        commentsSortId = item.id
        condition = item.condition
      }
    })

    reactLocalStorage.set('comments_sort_id', commentsSortId)

    if (postsList.filters && typeof postsList.filters.comments_sort != 'undefined' && condition == postsList.filters.comments_sort) {
      return
    }

    if (condition) {
      filters.comments_sort = condition
      filters.include_comments = 1
    } else {
      delete filters.comments_sort
      delete filters.include_comments
    }

    this.setState({
      commentsSortId: commentsSortId,
      timestamp: new Date().getTime(),
      filters
    })

  }

  render() {

    const { name, filters, timestamp, commentsSort, commentsSortId } = this.state
    const { me } = this.props

    return(<div>
      <Meta />
      <Nav />

      <div className="container">
        <div className="container-head">
          最新动态
          {me._id ?
            <div className="right">
              评论显示偏好：
              <select onChange={(e)=>{ this.onChange(e.target.value) }} value={commentsSortId}>
                {commentsSort.map((item, index)=>{
                  return (<option key={index} value={item.id}>{item.name}</option>)
                })}
              </select>
            </div>
            : null}
        </div>
        <PostsList
          name={name}
          displayDate={false}
          timestamp={timestamp}
          filters={filters}
          />
      </div>

    </div>)
  }

}


Home.propTypes = {
  me: PropTypes.object.isRequired,
  postsList: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    me: getProfile(state),
    postsList: getPostsListByName(state, 'home')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

Home = connect(mapStateToProps,mapDispatchToProps)(Home)

export default Shell(Home)
