import React from 'react';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';

@Shell
export default class Topics extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(<div>
      <Meta title="话题" />
      <h2>Topics</h2>
    </div>)
  }
  
}
