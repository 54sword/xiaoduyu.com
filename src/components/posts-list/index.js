import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

// import styles from './style.scss'

// 依赖的外部功能
import arriveFooter from '../../common/arrive-footer'

// actions and reducers
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadPostsList } from '../../actions/posts'
import { getPostsListByName } from '../../reducers/posts'

import ListLoading from '../list-loading'
import PostsItem from '../posts-item'

export class PostsList extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    const { postsList, loadPostsList, name, filters } = this.props

    if (!postsList.data) {
      loadPostsList({ name, filters })
    }

    arriveFooter.add(name, ()=>{
      loadPostsList({ name, filters })
    })
  }

  componentWillUnmount() {
    const { name } = this.props
    arriveFooter.remove(name)
  }

  /*
  componentWillReceiveProps(props) {

    if (props.update != this.props.update) {

      const { resetNewQuestionList, loadQuestions } = this.props

      // console.log(props.update + '|' + this.props.update)

      resetNewQuestionList({ name: props.name, filters: props.filters })
      loadQuestions()
    }
  }
  */

  render () {
    const { displayDate = true, postsList, loadPostsList } = this.props

    // 当没有数据的情况
    if (typeof postsList.data == "undefined") {
      return (<div></div>)
    }

    const { data, loading, more } = postsList

    return (
      <div>
        {data.map(posts=>{
          return (<div key={posts._id}><PostsItem posts={posts} displayDate={displayDate} /></div>)
        })}
        <ListLoading loading={loading} more={more} handleLoad={loadPostsList} />
      </div>
    )
  }

}

PostsList.propTypes = {
  postsList:  PropTypes.object.isRequired
}

const mapStateToProps = (state, props) => {
  const { name } = props
  return {
    postsList: getPostsListByName(state, name)
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadPostsList: bindActionCreators(loadPostsList, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostsList)
