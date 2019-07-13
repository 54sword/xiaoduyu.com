import React, { useState } from 'react';

// redux
import { useSelector, useStore } from 'react-redux';
import { getUserInfo } from '@reducers/user';
import { like, unlike } from '@actions/like';

import Loading from '@components/ui/loading';

// style
import './style.scss';

interface Props {
  comment: any,
  posts: any,
  reply: any
  // displayNumber: boolean
}

export default function({ comment, posts, reply }: Props) {

  const [ loading, setLoading ] = useState(false);

  const me = useSelector((state: object)=>getUserInfo(state));
  const store = useStore();
  const _link = (args: object)=>like(args)(store.dispatch, store.getState);
  const _unlike = (args: object)=>unlike(args)(store.dispatch, store.getState);
 
  const target = comment || reply || posts;

  let text = target.like_count ? target.like_count+' 次赞' : '赞';

  if (me && target.user_id && target.user_id._id && target.user_id._id == me._id) return null; 

  if (loading) return <a href="javascript:void(0)"><div styleName="loading"><Loading /></div></a>;

  const handleLike = async function(e: any) {

    e.stopPropagation();

    const target = comment || reply || posts;

    console.log(target);

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
        Toastify({
          text: err,
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
        }).showToast();
      }

    } else {

      let [ err, res ] = await _link({
        type: type,
        target_id: targetId,
        mood: 1
      });

      if (err) {
        Toastify({
          text: err,
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
        }).showToast();
      }

    }

    setLoading(false);

  }

  

  return (<a
    href="javascript:void(0)"
    onClick={handleLike}
    styleName={`button ${target.like ? 'active' : ''}`}
    className="text-secondary"
    >
    <span>{text}</span>
  </a>)

}
