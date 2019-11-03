import React from 'react';
import { useSelector } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';
import HTMLText from '@app/components/html-text';

// style
import './styles/index.scss';

interface Props {
  message: {
    user_id: {
      _id: string
      avatar_url: string
    }
    content_html: string
  }
}

export default ({ message }: Props) => {

  const me = useSelector(getUserInfo);

  return (<div styleName={`item ${me && me._id == message.user_id._id ? 'right' : ''}`}>
    <div>
      <div styleName="avatar"><img src={message.user_id.avatar_url} /></div>
      <div styleName="content">
        <HTMLText content={message.content_html} />
      </div>
    </div>
  </div>)

}