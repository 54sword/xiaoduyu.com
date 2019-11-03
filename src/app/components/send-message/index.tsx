import React from 'react';
import useReactRouter from 'use-react-router';

// redux
import { useSelector, useStore } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';
import { getSession } from '@app/redux/actions/session';

interface Props {
  people_id: string;
  className?: string;
}

export default function({ people_id, className }: Props) {

  const { history } = useReactRouter();

  const me = useSelector((state: object)=>getUserInfo(state));
  const store = useStore();
  const _getSession = (args:object)=>getSession(args)(store.dispatch, store.getState);


  // 自己的问题，不能关注
  if (me && me._id && me._id == people_id) {
    return '';
  }

  const stopPropagation = function(e: any) {
    e.stopPropagation();
  }

  const handle = function(e: any) {
    e.stopPropagation();
    _getSession({ people_id }).then((res: any)=>{
      if (res) {
        history.push(`/session/${res}`);
      }
    })
  }

  const icon = (<svg
    width="15px"
    height="15px"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    className="mr-1"
    >
    <use xlinkHref="/feather-sprite.svg#message-circle"/>
  </svg>)
  
  if (!me) {
    return (<span className={className} data-toggle="modal" data-target="#sign" onClick={stopPropagation}>
      {icon}私信
    </span>)
  } else {
    return (<span className={className} onClick={handle}>
      {icon}私信
    </span>)
  }

}