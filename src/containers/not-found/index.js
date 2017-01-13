import React, { PropTypes } from 'react'
import Nav from '../../components/nav'
import Shell from '../../shell'

class NotFound extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    return (<div>
      <Nav />
      <div>页面不存在</div>
    </div>)
  }
}

export default Shell(NotFound)
