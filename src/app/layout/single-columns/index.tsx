import React from 'react';
import './index.scss';

interface Props {
  children?: object
}

export default function({ children }: Props) {
  return (<div styleName="box">
    {children}
  </div>)
}

/*
export default class Box extends React.PureComponent {
  render() {
    return (<div styleName="box">
        {this.props.children}
      </div>)
  }
}
*/
