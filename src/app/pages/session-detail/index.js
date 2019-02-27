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
import ThreeColumns from '../../layout/three-columns';

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
      loading: true
    }
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    let { list, loadList, readSession } = this.props;
    if (!list.data) {
      await loadList({
        id,
        filters: { query: { _id: id } }
      });
    }

    list = this.props.list;

    if (list && list.data && list.data[0]) {

      this.setState({
        session: list.data[0],
        loading: false
      });

      if (list.data[0].unread_count > 0) {
        readSession({ _id: id });
      }
    }

  }

  render() {

    const { id } = this.props.match.params;
    const { loading, session } = this.state;

    return(<>
      <Meta title={session ? session.user_id.nickname : 'loading...'} />

      <ThreeColumns>
        
        <>
        </>
        
        <>

          {loading ? <div>loading...</div> : null}

          {session ?
            <div styleName="box">
              
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
                <div styleName="editor">
                  <Editor addressee_id={session.user_id._id} />
                </div>
              : null}
              
            </div>
            : null}
        </>

        <>
        </>

      </ThreeColumns>
    </>)
  }

}
