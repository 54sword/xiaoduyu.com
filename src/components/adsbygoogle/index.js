import React, { Component } from 'react';

export default class AdsByGoogle extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    if (!window.adsbygoogle) {
      setTimeout(()=>{
        this.componentDidMount();
      }, 2000);
      return;
    }

    (adsbygoogle = window.adsbygoogle || []).push({});
  }
  
  render() {

    const { style, client, slot } = this.props;

    return (<ins className="adsbygoogle"
              style={style}
              data-ad-client={client}
              data-ad-slot={slot}>
            </ins>)
  }

}
