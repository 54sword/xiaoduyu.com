import React, { Component } from 'react';
import MetaTags, { ReactTitle } from 'react-meta-tags';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getUnreadNotice } from '../../store/reducers/website';

import { name } from '../../../config';

@connect(
  (state, props) => ({
    unreadNotice: getUnreadNotice(state)
  }),
  dispatch => ({
  })
)
export default class Meta extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { title, description, canonical, meta, link, unreadNotice } = this.props;

    let _title = '';

    if (unreadNotice && unreadNotice.length > 0) _title += `(${unreadNotice.length}条通知) ` ;
    _title += title || name;
    if (title) _title += ` - ${name}`;

    return (<>
      <ReactTitle title={_title} />
      {this.props.children ? <MetaTags>{this.props.children}</MetaTags> : null}
    </>)
  }
}
