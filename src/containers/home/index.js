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

let defaultProps = {
  filters: {
    weaken: 1,
    include_comments: 1,
    // method: 'user_custom'
  },
  name: 'home'
}

// 纯组件
export class Home extends React.Component {

  // 服务器预加载内容
  static loadData({ store }, callback) {

    const { filters, name } = defaultProps
    const me = getProfile(store.getState())

    if (me._id) {
      callback()
      return
    }

    filters.comments_sort = 'like_count:-1,reply_count:-1,create_at:-1'
    filters.include_comments = 4

    store.dispatch(loadPostsList({
      name,
      filters,
      callback: ()=>{
        callback()
      }
    }))

  }

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

    this.chooseCommentsSort = this.chooseCommentsSort.bind(this)
  }

  componentDidMount() {
    const { me } = this.props
    if (me._id) {
      const consition = reactLocalStorage.get('comments_sort_id') || 4
      this.chooseCommentsSort(consition)
    } else {
      this.chooseCommentsSort()
    }
  }

  chooseCommentsSort(id) {

    const { name, filters, commentsSort } = this.state
    const { postsList } = this.props

    let condition = 'like_count:-1,reply_count:-1,create_at:-1'
    let commentsSortId = 4

    commentsSort.map(item=>{
      if (item.id == id) {
        commentsSortId = item.id
        condition = item.condition
      }
    })

    reactLocalStorage.set('comments_sort_id', commentsSortId)

    if (postsList.filters
        && typeof postsList.filters.comments_sort != 'undefined'
        && condition == postsList.filters.comments_sort
        || postsList.filters
        && typeof postsList.filters.comments_sort == 'undefined'
        && !condition
      ) {
        this.setState({
          commentsSortId: commentsSortId
        })
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

  componentWillReceiveProps(props) {

    if (props) {
      const taba = this.props.location.query.tab || ''
      const tabb = props.location.query.tab || ''

      if ( taba != tabb ) {
        this.setState({
          timestamp: new Date().getTime()
        })
      }

    }

  }

  render() {

    let { name, filters, timestamp, commentsSort, commentsSortId } = this.state
    const { me, newPostsList, showNewPosts, showSign } = this.props

    const { tab = '' } = this.props.location.query

    if (tab == 'follow') {
      filters.method = 'user_custom'
      filters.device = 'ios'
    } else {
      delete filters.method
      delete filters.device
    }

    // <div className={styles['posts-type']}>
    //     <a href="javascript:void(0)" onClick={showSign}><span className={styles.talk}>说说</span></a>
    //     <a href="javascript:void(0)" onClick={showSign}><span className={styles.ask}>提问</span></a>
    //     <a href="javascript:void(0)" onClick={showSign}><span className={styles.write}>写文章</span></a>
    //   </div>

    return(<div>
      <Meta />
      <Nav />

      <div className="container">

        {newPostsList.data && newPostsList.data.length > 0 ?
          <a href="javascript:void(0)" styleName="tips" onClick={showNewPosts}>有 {newPostsList.data.length} 篇新帖子</a>
          : null}

        {/*me._id ?
          <div styleName="posts-type">
            <Link to="/write-posts"><span styleName="talk">说说</span></Link>
            <Link to="/write-posts?type=2"><span styleName="ask">提问</span></Link>
            <Link to="/write-posts?type=3"><span styleName="write">写文章</span></Link>
          </div>
          : null*/}

        {me._id ?
          <div styleName="posts-type">
            <Link to="/write-posts"><span>发布话题</span></Link>
          </div>
          : null}

        {me._id ?
          <div styleName="tab-bar">
            <Link styleName={tab == '' ? 'tab-bar-active' : null} to="/">发现</Link>
            <Link styleName={tab == 'follow' ? 'tab-bar-active' : null} to="/?tab=follow">关注</Link>
          </div>
          : null}

        {/*
        <div styleName="tab-bar">

          <div className={styles.category}>
            <a href="#">全部</a>
            <a href="#">说说</a>
            <a href="#">提问</a>
            <a href="#">文章</a>
          </div>

          {me._id ?
            <div className="right">
              评论：
              <select className="select" onChange={(e)=>{ this.chooseCommentsSort(e.target.value) }} value={commentsSortId}>
                {commentsSort.map((item, index)=>{
                  return (<option key={index} value={item.id}>{item.name}</option>)
                })}
              </select>
            </div>
            : null}
        </div>
        */}

        <div styleName={me._id ? 'posts-list' : ''}>
          <PostsList
            name={name + tab}
            displayDate={false}
            displayFollow={true}
            timestamp={timestamp}
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

        <Footer />
      </div>

    </div>)
  }

}


Home = CSSModules(Home, styles)

Home.defaultProps = defaultProps

Home.propTypes = {
  me: PropTypes.object.isRequired,
  postsList: PropTypes.object.isRequired,
  newPostsList: PropTypes.object.isRequired,
  showNewPosts: PropTypes.func.isRequired,
  showSign: PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    me: getProfile(state),
    postsList: getPostsListByName(state, defaultProps.name),
    newPostsList: getPostsListByName(state, 'new')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showNewPosts: bindActionCreators(showNewPosts, dispatch),
    showSign: bindActionCreators(showSign, dispatch)
  }
}

Home = connect(mapStateToProps,mapDispatchToProps)(Home)

export default Shell(Home)
