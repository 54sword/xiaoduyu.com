import React from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '@reducers/user';

// modules
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import MessageList from '@modules/message-list';
import SessionList from '@modules/session-list';
// layout
import ThreeColumns from '../../layout/three-columns';

// import { Goole_AdSense } from '@config';

@Shell
@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
  })
)
export default class MessagePage extends React.PureComponent {

  render() {

    const { me } = this.props;

    return(<>
      <Meta />

      <ThreeColumns>
        
        <>
        </>
        
        <>
          <SessionList
            id="all"
            filters={{
              query: {
                sort_by:'last_message:-1'
              }
            }}
            />
        </>

        <>
        </>

      </ThreeColumns>
    </>)
  }

}
