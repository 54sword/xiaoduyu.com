import React from 'react';
import PropTypes from 'prop-types';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '@reducers/user';

import HTMLText from '@components/html-text';

// style
import './index.scss';

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

    if (me._id == message.user_id._id) {

      return (<div styleName="item right">
        <div>
          <div styleName="avatar"><img src={message.user_id.avatar_url} /></div>
          <div styleName="content">
            <HTMLText content={message.content_html} />
          </div>
        </div>
      </div>)

    } else {

      return (<div styleName="item">
        <div>
          <div styleName="avatar"><img src={message.user_id.avatar_url} /></div>
          <div styleName="content">
            <HTMLText content={message.content_html} />
          </div>
        </div>
      </div>)

    }


  }

}
