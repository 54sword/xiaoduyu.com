import React from 'react';
// import { browserHistory } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getPostsTypeById } from '../../reducers/posts-types';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
// import Nav from '../../components/nav'
import PostsEditor from '../../components/editor-posts'


@connect(
  (state, props) => ({
    getPostsTypeById: (id)=>{
      return getPostsTypeById(state, id)
    }
  }),
  dispatch => ({
  })
)
class createPosts extends React.Component {

  // static loadData(option, callback) {
  //   const { id } = option.props.params
  //
  //   if (!id) {
  //     callback()
  //     return
  //   }
  //
  //   option.store.dispatch(loadTopicById({ id: id, callback: (topic)=>{
  //     if (!topic) {
  //       callback('not found')
  //     } else {
  //       callback()
  //     }
  //   }}))
  // }

  constructor(props) {
    super(props)

    // let type = this.props.location.query.type || 1
    //
    // this.state = {
    //   type: this.props.getPostsTypeById(type)
    // }

    this.successCallback = this.successCallback.bind(this)
  }

  successCallback(posts) {
    this.props.history.push(`/posts/${posts._id}?subnav_back=/`)
  }

  render() {
    // const { type } = this.state
    return (<div>
      <Meta title={'创建帖子'} />
      {/* <Nav /> */}
      <PostsEditor successCallback={this.successCallback} />
    </div>)
  }

}

export default Shell(createPosts)
