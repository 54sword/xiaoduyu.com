import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getTopicListByKey } from '../../store/reducers/topic';

import SidebarTopic from '../sidebar/topic';

// style
import './index.scss';

@withRouter
@connect(
  (state, props) => ({
    topicList: getTopicListByKey(state, 'head')
  }),
  dispatch => ({
  })
)
export default class Box extends Component {

  render() {

    const { topicList } = this.props;

    let path = this.props.match.path;
    let topicId = '';

    if (path == '/topic/:id') {
      topicId = this.props.match.params.id;
    }

    return (<div styleName="box">
        <div styleName="left">

          <SidebarTopic />

          {/*(()=>{

            if (!topicList) return null;
            const { loading, data } = topicList;

            if (loading) {
              return <div>loading...</div>
            }

            return data.map(item=>{
              return (<div key={item._id}>
                <div><Link styleName={item._id == topicId ? 'active' : ''} to={`/topic/${item._id}`}><b>{item.name}</b></Link></div>
                <div styleName="topic-list">
                  {item.children.map(item=>{
                    return <Link styleName={item._id == topicId ? 'active' : ''} to={`/topic/${item._id}`} key={item._id}>{item.name}</Link>
                  })}
                </div>
              </div>)
            });


          })()*/}
        </div>
        <div>
          {this.props.children[0]}
        </div>
        <div styleName="right">
          {this.props.children[1]}
        </div>
      </div>)
  }
}
