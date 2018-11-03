import React from 'react';
// import Loadable from 'react-loadable';

// components
// import Bundle from '../bundle';
// import { AsyncComponent } from '../generate-async-component';

// import('../global')

import Aglobal from '../global';

// style
import './style.scss';

// const LoadableFooter = Loadable({
//   loader: () => import('../global'),
//   loading: () => <div>loading...</div>
// });

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

      {/* <LoadableFooter /> */}

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
