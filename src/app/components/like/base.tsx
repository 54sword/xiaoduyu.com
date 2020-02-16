import React, { useState } from 'react';

// redux
import { useSelector, useStore } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';
import { like, unlike } from '@app/redux/actions/like';

import Loading from '@app/components/ui/loading';

// style
import './styles/index.scss';

interface Props {
  comment: any,
  posts: any,
  reply: any,
  children: any
  // styleType: string
  // displayNumber: boolean
}

export default function({ comment, posts, reply, children }: Props) {

  const [ loading, setLoading ] = useState(false);

  const me = useSelector((state: object)=>getUserInfo(state));
  const store = useStore();
  const _link = (args: object)=>like(args)(store.dispatch, store.getState);
  const _unlike = (args: object)=>unlike(args)(store.dispatch, store.getState);
 
  const target = comment || reply || posts;

  // console.log(target);

  // let text = target.like_count ? target.like_count+' 次赞' : '赞';

  if (me && target.user_id && target.user_id._id && target.user_id._id == me._id) return null; 

  if (loading) return <Loading />;

  const handleLike = async function(e: any) {

    e.stopPropagation();

    const target = comment || reply || posts;

    // console.log(target);

    const status = target.like,
          count = target.like_count,
          targetId = target._id
    let type = '';

    if (!me) {
      $('#sign').modal({
        show: true
      }, {
        'data-type': 'sign-in'
      });
      return;
    }

    if (comment) {
      type = 'comment'
    } else if (reply) {
      type = 'reply'
    } else {
      type = 'posts'
    }

    setLoading(true);

    // await new Promise(resolve=>{
    //   setTimeout(()=>{
    //     resolve();
    //   }, 1000);
    // });

    if (status) {

      let [ err, res ] = await _unlike({
        type: type,
        target_id: targetId
      });

      if (err) {
        $.toast({
          text: err,
          position: 'top-center',
          showHideTransition: 'slide',
          icon: 'error',
          loader: false,
          allowToastClose: false
        });
      }

    } else {

      let [ err, res ] = await _link({
        type: type,
        target_id: targetId,
        mood: 1
      });

      if (err) {
        $.toast({
          text: err,
          position: 'top-center',
          showHideTransition: 'slide',
          icon: 'error',
          loader: false,
          allowToastClose: false
        });
      }

    }

    setLoading(false);

  }  

  /*
  if (styleType == 'text') {
    return (<span onClick={handleLike} className="a text-secondary">
      {target.like ? '已赞' : '赞'}
    </span>)
  }
  */

  return <span onClick={handleLike} className="a text-secondary">{children}</span>

  // if (styleType == 'icon') {
  //   return (<span styleName="icon-button">
  //     <svg
  //       width="20px"
  //       height="20px"
  //       stroke="currentColor"
  //       strokeWidth={1.8}
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //       fill="none"
  //       >
  //       <use xlinkHref="/feather-sprite.svg#thumbs-up" />
  //     </svg>
  //     {target.like_count || ''}
  //   </span>)
  // }

  return null;
}
