import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { loadPostsById } from '../../actions/posts'
import { getProfile } from '../../reducers/user'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Nav from '../../components/nav'
import PostsEditor from '../../components/posts-editor'

class EditPosts extends React.Component {

  static loadData({ store, props }, callback) {
    const { id } = props.params

    const me = getProfile(store.getState())

    if (!me._id) {
      callback(403, 'wrong_token')
      return
    }
    
    store.dispatch(loadPostsById({
      id,
      callback: (posts)=>{
        if (!posts) {
          callback(404)
        } else if (!me._id || posts.user_id._id != me._id) {
          callback(403, 'wrong_token')
        } else {
          callback()
        }
      }
    }))
  }

  constructor(props) {
    super(props)
    this.state = {
      posts: null
    }
    this.successCallback = this.successCallback.bind(this)
  }

  componentDidMount() {
    const self = this
    const { id } = this.props.params
    const { loadPostsById } = this.props

    loadPostsById({
      id: id,
      callback: (posts)=>{
        if (posts) {
          self.setState({ posts: posts })
        } else {
          browserHistory.push('/')
        }
      }
    })
  }

  successCallback() {
    this.context.router.goBack()
  }

  render() {
    const { posts } = this.state

    if (!posts) {
      return (<div>加载中...</div>)
    }

    return (<div>
      <Meta meta={{title: '编辑帖子'}} />
      <Nav />
      <PostsEditor {...posts} successCallback={this.successCallback} />
    </div>)
  }

}

EditPosts.contextTypes = {
  router: PropTypes.object.isRequired
}

EditPosts.propTypes = {
  loadPostsById: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadPostsById: bindActionCreators(loadPostsById, dispatch)
  }
}

EditPosts = connect(mapStateToProps, mapDispatchToProps)(EditPosts)

export default Shell(EditPosts)
