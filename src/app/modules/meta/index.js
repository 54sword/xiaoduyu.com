import React, { Component } from 'react';
import MetaTags, { ReactTitle } from 'react-meta-tags';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getUnreadNotice } from '@reducers/website';
import { getTipsById } from '@reducers/tips';

import { name } from '@config';

@connect(
  (state, props) => ({
    unreadNotice: getUnreadNotice(state),
    hasFeed: getTipsById(state, 'home') || getTipsById(state, 'feed') || getTipsById(state, 'subscribe') || getTipsById(state, 'excellent'),
    hasSessions: getTipsById(state, 'unread-message') 
  }),
  dispatch => ({
  })
)
export default class Meta extends Component {

  constructor(props) {
    super(props);
  }
  
  render() {

    const { title, unreadNotice, hasFeed, hasSessions } = this.props;

    let _title = '';

    if (hasSessions) _title += `(${hasSessions}条私信) `;
    if (unreadNotice && unreadNotice.length > 0) _title += `(${unreadNotice.length}条通知) ` ;
    if (hasFeed) _title += `(有新动态) ` ;
    
    _title += title || name;
    if (title) _title += ` - ${name}`;

    return (<>
      <ReactTitle title={_title} />
      {this.props.children ? <MetaTags>{this.props.children}</MetaTags> : null}
    </>)
  }
}
