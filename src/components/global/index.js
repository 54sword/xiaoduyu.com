import React, { Component } from 'react'

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '../../store/reducers/user';

// components
import SignModal from './sign-modal';
import EditorModalComment from './editor-comment-modal';
import ReportModal from './report-modal';
import BindingPhone from './binding-phone-modal';
import UnlockToken from './unlock-token-modal';
// import PostsModal from '../posts/modal';
// import CommentModal from '../comment/modal';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
  })
)
class Global extends Component {

  // constructor(props) {
    // super(props)
  // }

  componentDidMount() {
  }

  render () {

    const { me } = this.props;

    return (<div>

        {/* <PostsModal /> */}
        {/* <CommentModal /> */}

        {!me ? <SignModal /> : null}
        {me ? <EditorModalComment /> : null}
        {me ? <ReportModal /> : null}
        {me ? <BindingPhone /> : null}
        {me ? <UnlockToken /> : null}

      </div>)
  }
}


export default Global;
