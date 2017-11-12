import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import CSSModules from 'react-css-modules'
import styles from './style.scss'


import Masonry from 'react-masonry-component'

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
    this.loadDate = this.loadDate.bind(this)
  }

  componentDidMount() {

    const { postsList, loadPostsList, name, filters } = this.props

    if (!postsList.data) {
      this.loadDate()
    }
    
    arriveFooter.add(name, ()=>{
      this.loadDate()
    })
  }

  componentWillUnmount() {
    const { name } = this.props
    arriveFooter.remove(name)
  }

  loadDate() {
    const { name, filters, loadPostsList } = this.props
    loadPostsList({ name, filters })
  }

  componentWillReceiveProps(props) {
    if (props.timestamp != this.props.timestamp) {
      const { loadPostsList } = this.props
      loadPostsList({ name: props.name, filters: props.filters, restart: true })
    }
  }

  render () {
    const { displayFollow = false, displayDate = true, postsList, loadPostsList, commentOption = {} } = this.props

    // 当没有数据的情况
    if (typeof postsList.data == "undefined") {
      return (<div></div>)
    }

    const { data, loading, more } = postsList

    return (
      <div>

        <Masonry
            className={'my-gallery-class'} // default ''
            elementType={'div'} // default 'div'
            options={{
                transitionDuration: 0
            }} // default {}
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
          {data.map(posts=>{
            return (<div key={posts._id} styleName="item"><div>
                <PostsItem
                posts={posts}
                displayFollow={displayFollow}
                displayDate={displayDate}
                commentOption={commentOption}
                />
              </div></div>)
          })}
      </Masonry>
        {/*
        <div styleName="grid">
          {data.map(posts=>{
            return (<div key={posts._id}>
                <PostsItem
                posts={posts}
                displayFollow={displayFollow}
                displayDate={displayDate}
                commentOption={commentOption}
                />
              </div>)
          })}
        </div>
        */}
        <ListLoading
          loading={loading}
          more={more}
          handleLoad={loadPostsList}
          />
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

PostsList = CSSModules(PostsList, styles)

export default connect(mapStateToProps, mapDispatchToProps)(PostsList)
