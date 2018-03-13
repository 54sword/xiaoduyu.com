import React, { Component } from 'react';

// https://github.com/kodyl/react-document-meta
import DocumentMeta from 'react-document-meta';

export class Meta extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    let metaObj = {}

    const { title, description, canonical, meta } = this.props;

    if (title) metaObj.title = title;
    if (description) metaObj.description = description;
    if (canonical) metaObj.canonical = canonical;
    if (meta) metaObj.title = meta;

    return (
      <DocumentMeta {...metaObj} />
    )
  }
}

export default Meta;
