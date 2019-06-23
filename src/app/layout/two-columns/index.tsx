import React, { useEffect } from 'react';
import './index.scss';

interface Props {
  children?: Array<object>
}

export default function ({ children }: Props) {

  useEffect(()=>{

    let rightHeight = 0;

    // setTimeout(()=>{

    //   $('#sidebar').portamento({disableWorkaround: true}); 

    // }, 2000);

    // $('#right-float').portamento();

    let _el = null;

    // setTimeout(()=>{
      _el = FloatFixed.add({
        referId: 'right',
        id: 'right-float',
        offsetTop: 60
      });
    // }, 2000);
    
    /*
    const scroll = () => {
      let scrollTop = $(window).scrollTop();
      if (rightHeight && scrollTop > rightHeight) {
        $('#right-float').css({display:'block'});
      } else {
        $('#right-float').css({display:'none'});
      }
    };
    
    const timer = setInterval(function(){
      rightHeight = $('#right').height();
    }, 500);

    $(window).scroll(scroll);

    return ()=>{
      $(window).unbind('scroll', scroll);
      clearInterval(timer);
    }
    */

    return ()=>{
      FloatFixed.remove(_el);
    }

  }, []);

  return (<div styleName="box">
    <div id="center">{children[0]}</div>
    <div styleName="right" >
      <div id="right">{children[1]}</div>
      <div id="right-float" styleName="right-float">{children[2] || null}</div>
    </div>
  </div>)
}