import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getPostsTypeById } from '../../reducers/posts-types'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Nav from '../../components/nav'
import PostsEditor from '../../components/posts-editor'

class WritePosts extends React.Component {

  static loadData(option, callback) {
    const { id } = option.props.params

    if (!id) {
      callback()
      return
    }

    option.store.dispatch(loadTopicById({ id: id, callback: (topic)=>{
      if (!topic) {
        callback('not found')
      } else {
        callback()
      }
    }}))
  }

  constructor(props) {
    super(props)

    let type = this.props.location.query.type || 1

    this.state = {
      type: this.props.getPostsTypeById(type)
    }

    this.successCallback = this.successCallback.bind(this)
  }

  componentWillMount() {
  }

  successCallback(posts) {
    browserHistory.push('/posts/'+posts._id+'?subnav_back=/')
  }
  
  render() {
    const { type } = this.state

    return (<div>
      <Meta meta={{ title: type.name }} />
      <Nav />
      <PostsEditor type={type._id} successCallback={this.successCallback} />
    </div>)
  }

}

WritePosts.propTypes = {
}

function mapStateToProps(state, props) {
  return {
    getPostsTypeById: (id)=>{
      return getPostsTypeById(state, id)
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

WritePosts = connect(mapStateToProps, mapDispatchToProps)(WritePosts)

export default Shell(WritePosts)
