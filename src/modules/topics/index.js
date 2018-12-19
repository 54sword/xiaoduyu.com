
/**
 * 话题分类
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadTopics } from '@actions/topic';
import { getTopicListByKey } from '@reducers/topic';
import { saveTopicId } from '@actions/website';
import { isMember } from '@reducers/user';

import { hasNewFeed } from '@reducers/website';

// style
import './index.scss';

// @withRouter
@connect(
  (state, props) => ({
    isMember: isMember(state),
    topicList: getTopicListByKey(state, 'recommend-topics'),
    hasNewFeed: hasNewFeed(state)
  }),
  dispatch => ({
    loadTopics: bindActionCreators(loadTopics, dispatch),
    saveTopicId: bindActionCreators(saveTopicId, dispatch)
  })
)
export default class Box extends Component {

  constructor(props) {
    super(props);
    this.state = {
      topicId: null,
      // 子话题显示长度
      maxLenth: 30,
      // 展开状态记录
      expand: {}
    }
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {

    const { topicList, loadTopics } = this.props;

    if (!topicList ||
        !topicList.data ||
        !topicList.data.length
    ) {
      loadTopics({
        id: 'recommend-topics',
        filters: { variables: { type: "parent", recommend: true, sort_by: 'sort:-1' } }
      });
    }

    let topicId = cookie.load('topic_id') || '';

    this.setState({ topicId });
  }

  onClick(event, id) {
    event.preventDefault();
    
    cookie.save(
      'topic_id',
      id,
      {
        path: '/',
        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365)
      }
    );
    
    this.setState({ topicId: id });
    this.props.saveTopicId(id);

    // 置顶
    window.scrollTo(0, 0);
  }

  handleExpand(id) {
    let { expand } = this.state;
    expand[id] = expand[id] ? false : true;
    this.setState({ expand });
  }

  render() {

    const { topicId, expand, maxLenth } = this.state;
    const { topicList, isMember, hasNewFeed } = this.props;

    if (!topicList) return null;

    const { loading, data } = topicList;

    if (loading) return <div>loading...</div>;
    if (!data) return;

    return (<div className="card">
      <div className="card-body" styleName="container">

        {/* <div styleName="group">
          <div>
            <Link to="/" styleName={topicId == '' ? 'active' : ''} onClick={e=>this.onClick(e, '')}>全部</Link>
          </div>
        </div> */}

        <div styleName="group">
          <div>
          </div>
          <div>
            <Link to="/" styleName={topicId == '' ? 'active' : ''} onClick={e=>this.onClick(e, '')}>全部</Link>
            <Link to="/" styleName={topicId == 'excellent' ? 'active' : ''} onClick={e=>this.onClick(e, 'excellent')}>优选</Link>
            {isMember &&
            <Link to="/follow" styleName={topicId == 'follow' ? 'active' : ''} onClick={e=>this.onClick(e, 'follow')}>
              关注
              {hasNewFeed && <span styleName="point"></span>}
            </Link>}
          </div>
        </div>

        {/*isMember ?
          <div styleName="group">
            <div>
              <Link to="/follow" styleName={topicId == 'follow' ? 'active' : ''} onClick={e=>this.onClick(e, 'follow')}>关注</Link>
              {hasNewFeed ? <span styleName="point"></span> : null}
            </div>
            <div>
              <a href="#">帖子</a>
              <a href="#">用户</a>
            </div>
          </div>
        : null*/}

        {data.map(item=>{

          return (<div key={item._id} styleName="group">

            <div>
              <Link styleName={item._id == topicId ? 'active' : ''} to={`/topic/${item._id}`} onClick={e=>this.onClick(e, item._id)}>
                {item.name}
              </Link>
            </div>

            <div>
              {item.children && item.children.map((subitem, index)=>{
                if (!expand[item._id] && index > maxLenth) return;
                return (<Link
                  key={subitem._id}
                  styleName={subitem._id == topicId ? 'active' : ''}
                  to={`/topic/${subitem._id}`}
                  onClick={e=>this.onClick(e, subitem._id)}
                  >
                  {subitem.name}
                </Link>)
              })}
            </div>

            {item.children && item.children.length - 1 > maxLenth ?
              <div>
                <a href="javascript:void(0)" onClick={()=>this.handleExpand(item._id)}>
                  {expand[item._id] ? '收起' : '展开'}
                </a>
              </div>
              : null}

          </div>)
        })}

        </div>
      </div>)
  }
}
