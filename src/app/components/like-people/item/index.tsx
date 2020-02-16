import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import './styles/index.scss';

export default function({ data, index }: any) {

  useEffect(()=>{

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })

  }, []);

  let _index = 30 - index;

  return <Link to={`/people/${data.user_id._id}`} styleName="item" style={{zIndex: _index}}>
    <img
      src={data.user_id.avatar_url}
      styleName="avatar"
      alt={data.user_id.nickname}
      data-toggle="tooltip"
      data-placement="top"
      title={data.user_id.nickname}
      />
  </Link>
}