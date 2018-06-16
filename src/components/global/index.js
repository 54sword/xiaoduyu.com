import React, { Component } from 'react'

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '../../reducers/user';

// components
import Sign from '../sign';
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
class Global extends Component {

  constructor(props) {
    super(props)
  }

  render () {

    const { me } = this.props;

    return (<div>

        {!me ? <Sign /> : null}
        {me ? <EditorModalComment /> : null}
        {me ? <ReportModal /> : null}
        {me ? <BindingPhone /> : null}
        {me ? <UnlockToken /> : null}
      </div>)
  }
}

export default Global;
