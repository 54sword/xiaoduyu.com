import React from 'react';
import ContentLoader from 'react-content-loader';

import './index.scss';

export default function() {

  return (
    <div styleName="box">
      <ContentLoader
        uniquekey="content-loader"
        width="270" style={{ height:'140px', marginLeft:'15px', marginTop:'15px' }} primaryColor={"#eaedf0"}  secondaryColor={'#f6f9fc'}>
        <rect x="0" y="0" rx="25" ry="25" width="45" height="45" />
        <rect x="55" y="10" rx="4" ry="4" width="40" height="8" />
        <rect x="55" y="25" rx="3" ry="3" width="100" height="8" />

        <rect x="0" y="55" rx="3" ry="3" width="200" height="8" />
        <rect x="0" y="70" rx="3" ry="3" width="250" height="8" />
        <rect x="0" y="85" rx="3" ry="3" width="220" height="8" />
      </ContentLoader>
    </div>
  )

}

/*
export default class UIContentLoader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMount: false
    }
  }

  componentDidMount() {
    this.setState({ isMount: true });
  }

  render() {

    if (!this.state.isMount) return null;
    
    return (<>
      
      <div styleName="box">
        <ContentLoader width="270" style={{ height:'140px', marginLeft:'15px', marginTop:'15px' }} primaryColor={"#eaedf0"}  secondaryColor={'#f6f9fc'}>
          <rect x="0" y="0" rx="25" ry="25" width="45" height="45" />
          <rect x="55" y="10" rx="4" ry="4" width="40" height="8" />
          <rect x="55" y="25" rx="3" ry="3" width="100" height="8" />

          <rect x="0" y="55" rx="3" ry="3" width="200" height="8" />
          <rect x="0" y="70" rx="3" ry="3" width="250" height="8" />
          <rect x="0" y="85" rx="3" ry="3" width="220" height="8" />
        </ContentLoader>
      </div>
      
    </>)
  }

}
*/
