import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// redux
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import { getProfile } from '@reducers/user';

// style
import './index.scss';

interface Props {
  message: any
}

export default function({ message }: Props) {
  return (
    <Link to={`/session/${message._id}`} styleName="item" className="d-flex bd-highlight list-group-item">

      <div className="w-100 bd-highlight">
        <div styleName="main">
          {message.unread_count ? <div styleName="unread">{message.unread_count}</div> : null}
          <div styleName="avatar">
            <img src={message.user_id.avatar_url} />
          </div>
          <div styleName="nickname">
            {message.user_id.nickname}
          </div>
          {message.last_message ?
            <div styleName="content">{message.last_message.content_summary}</div>
            : null}
        </div>
      </div>
      
      <div className="flex-shrink-1 bd-highlight">
        <div styleName="create-at">{message.last_message ? message.last_message._create_at : message._create_at}</div>
      </div>

    </Link>
  )
}

/*
@connect(
  (state, props) => {
    return {
      me: getProfile(state)
    }
  },
  dispatch => ({
  })
)
export default class ListItem extends React.Component {

  static propTypes = {
    // 话题的id
    message: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {

    const { me, message } = this.props;

    // 自己发送的消息


      return (<Link to={`/session/${message._id}`} styleName="item" className="d-flex bd-highlight list-group-item">
        <div className="w-100 bd-highlight">
          <div styleName="main">
            {message.unread_count ? <div styleName="unread">{message.unread_count}</div> : null}
            <div styleName="avatar">
              <img src={message.user_id.avatar_url} />
            </div>
            <div styleName="nickname">
              {message.user_id.nickname}
            </div>
            {message.last_message ?
              <div styleName="content">{message.last_message.content_summary}</div>
              : null}
          </div>
        </div>
        
        <div className="flex-shrink-1 bd-highlight">
          <div styleName="create-at">{message.last_message ? message.last_message._create_at : message._create_at}</div>
        </div>

      </Link>)



  }

}

*/