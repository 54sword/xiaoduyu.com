import React from 'react';
import './index.scss';

export default class Box extends React.Component {
  
  componentDidMount() {

    // let $left = $('#left');
    let rightHeight = 0;
    // let y = $('#center').offset().top;
    // let headHeight = 55;
    
    this.scroll = () => {
      let scrollTop = $(window).scrollTop();
      // $left.css({ top: scrollTop >= y - headHeight ? headHeight : y - scrollTop });

      // console.log(scrollTop);
      
      if (rightHeight && scrollTop > rightHeight) {
        $('#right-float').css({display:'block'});
      } else {
        $('#right-float').css({display:'none'});
      }
    };
    
    this.timer = setInterval(function(){
      // this.scroll();
      rightHeight = $('#right').height();
    }, 500);

    $(window).scroll(this.scroll);

  }

  componentWillUnmount() {
    $(window).unbind('scroll', this.scroll);
    clearInterval(this.timer);
  }

  render() {
    return (<div styleName="box">
        <div id="center">
          {this.props.children[0]}
        </div>
        <div styleName="right" id="right">
          {this.props.children[1]}
          <div id="right-float" styleName="right-float">
            {this.props.children[2] || null}
          </div>
        </div>
      </div>)
  }
}
