import React from 'react';

// components
// import Bundle from '../bundle';
// import { AsyncComponent } from '../generate-async-component';

// import('../global')

import Aglobal from '../global';

// style
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@CSSModules(styles)
export class Footer extends React.Component {

  constructor(props) {
    super(props);
    this.top = this.top.bind(this);
  }

  componentDidMount () {

    $(window).scroll(function () {
      if ($(this).scrollTop() > 0) {
        $('#back-to-top').fadeIn();
      } else {
        $('#back-to-top').fadeOut();
      }
    });

  }

  top() {
    $('body,html').animate({
      scrollTop: 0
    }, 500);
  }

  render() {
    return(<div styleName="main">

      <span className="d-none d-lg-block">
        <a id="back-to-top"
           href="javascript:void(0)"
           onClick={this.top}
           styleName="top"
           ></a>
      </span>

      <Aglobal />

      {/*
      <AsyncComponent load={() => import('../global')}>
        {(Global) => {
          return (<Global />)
        }}
      </AsyncComponent>
      */}

    </div>)
  }

}

export default Footer;
