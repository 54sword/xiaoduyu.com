import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getUnreadNotice } from '../../reducers/website';

// https://github.com/kodyl/react-document-meta
import DocumentMeta from 'react-document-meta';

import { name } from '../../../config';

@connect(
  (state, props) => ({
    unreadNotice: getUnreadNotice(state)
  }),
  dispatch => ({
  })
)
export class Meta extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    let metaObj = {};

    const { title, description, canonical, meta, unreadNotice } = this.props;

    if (title) {
      metaObj.title = title + ' - ' + name;
    } else {
      metaObj.title = name;
    }

    if (description) metaObj.description = description;
    if (canonical) metaObj.canonical = canonical;
    if (meta) metaObj.title = meta;

    if (unreadNotice && unreadNotice.length > 0) {
      metaObj.title = `(${unreadNotice.length}条通知) ${metaObj.title}`
    }

    return (
      <DocumentMeta {...metaObj} />
    )
  }
}

export default Meta;
