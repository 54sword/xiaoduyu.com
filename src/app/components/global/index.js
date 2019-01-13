import React, { Component } from 'react'

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '@reducers/user';

// components
import SignModal from './sign-modal';
import EditorModalComment from './editor-comment-modal';
import ReportModal from './report-modal';
import BindingPhone from './binding-phone-modal';
import UnlockToken from './unlock-token-modal';


@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
  })
)
export default class Global extends Component {

  render () {

    const { me } = this.props;

    return (<>
        {!me ? <SignModal /> : null}
        {me ? <EditorModalComment /> : null}
        {me ? <ReportModal /> : null}
        {me ? <BindingPhone /> : null}
        {me ? <UnlockToken /> : null}
      </>)
  }
  
}
