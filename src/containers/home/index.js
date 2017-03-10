import React, { PropTypes } from 'react'
import { Link } from 'react-router'

// 外壳
import Shell from '../../shell'

// 依赖组件
import Nav from '../../components/nav'
import Meta from '../../components/meta'
import PostsList from '../../components/posts-list'

// actions
import { loadPostsList } from '../../actions/posts'

// 纯组件
class Home extends React.Component {

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
  }

  render() {

    return(<div>
      <Meta />
      <Nav />

      <div className="container">
        <div className="container-head">
          最新动态
          {/*<Link to="/topics" className="right">发布帖子</Link>*/}
        </div>
        <PostsList name={'home'} displayDate={false} filters={{method:'user_custom'}} />
      </div>

    </div>)
  }

}


export default Shell(Home)
