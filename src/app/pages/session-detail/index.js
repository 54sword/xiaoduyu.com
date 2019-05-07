import React from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadSessionList, readSession } from '@actions/session';
import { getSessionListById } from '@reducers/session';

// modules
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import MessageList from '@modules/message-list';

import Editor from '../../components/editor-message';

// layout
import SingleColumns from '../../layout/single-columns';

import './index.scss';

@Shell
@connect(
  (state, props) => {
    const { id } = props.match.params;
    return {
      list: getSessionListById(state, id)
    }
  },
  dispatch => ({
    loadList: bindActionCreators(loadSessionList, dispatch),
    readSession: bindActionCreators(readSession, dispatch)
  })
)
export default class SessionDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      session: null,
      loading: true,
      unread_count: 0
    }
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    let { list, loadList, readSession } = this.props;
    if (!list.data || !list.data[0]) {
      await loadList({
        id,
        filters: { query: { _id: id } }
      });
    }

    let session = this.props.list && this.props.list.data ? this.props.list.data[0] : null;

    if (session) {

      if (session.unread_count > 0) {
        readSession({ _id: id });
      }
      
      this.state.unread_count = session.unread_count;

      this.setState({
        session: session,
        loading: false
      });

    } else {
      this.props.notFoundPgae()
    }

  }

  
  componentWillReceiveProps(props) {

    if (this.state.loading) return;

    // 当前界面，有新的消息的时候，更新当前会话的为已读
    if (props.list && props.list.data && props.list.data[0]) {
      let session = props.list.data[0];
      if (session && session.unread_count > 0) {
        this.props.readSession({ _id: session._id });
      }  
    }

  }
  
  /*
  componentWillUnmount() {
    let session = this.props.list.data[0];
    if (session && session.unread_count > 0) {
      this.props.readSession({ _id: session._id });
    }
  }
  */

  render() {

    const { id } = this.props.match.params;
    const { loading, session } = this.state;

    return(
      <SingleColumns>

        <Meta title={session ? session.user_id.nickname : 'loading...'} />

        {loading ? <div>loading...</div> : null}
        
        {session ?
          <div styleName="box" className="card">
            
            <MessageList
              id={id}
              filters={{
                query: {
                  user_id: session.user_id._id+','+session.addressee_id._id,
                  addressee_id: session.user_id._id+','+session.addressee_id._id,
                  sort_by: 'create_at:-1'
                }
              }}
              />

            {!loading && session.user_id._id ?                
              <div styleName="editor" className="border-top">
                <Editor addressee_id={session.user_id._id} />
              </div>
            : null}
            
          </div>
          : null}

      </SingleColumns>
    )
  }

}
