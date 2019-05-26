
/**
 * 话题分类
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import cookie from 'react-cookies';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadTopicList } from '@actions/topic';
import { getTopicListById } from '@reducers/topic';
import { saveTopicId } from '@actions/website';
import { isMember } from '@reducers/user';

import { loadTips } from '@actions/tips';
import { getTipsById } from '@reducers/tips';

import { getTopicId } from '@reducers/website';

// style
import './index.scss';

// @withRouter
@connect(
  (state, props) => ({
    isMember: isMember(state),
    topicList: getTopicListById(state, 'recommend-topics'),
    topicId: getTopicId(state),
    hasNewHome: getTipsById(state, 'home'),
    hasNewFeed: getTipsById(state, 'feed'),
    hasNewSubscribe: getTipsById(state, 'subscribe'),
    hasNewExcellent: getTipsById(state, 'excellent')
  }),
  dispatch => ({
    loadTopicList: bindActionCreators(loadTopicList, dispatch),
    saveTopicId: bindActionCreators(saveTopicId, dispatch),
    loadTips: bindActionCreators(loadTips, dispatch)
  })
)
export default class Box extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMount: false,
      // topicId: null,
      // 子话题显示长度
      maxLenth: 30,
      // 展开状态记录
      expand: {}
    }
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {

    const { topicList, loadTopicList, loadTips, isMember } = this.props;

    if (!topicList ||
        !topicList.data ||
        !topicList.data.length
    ) {
      loadTopicList({
        id: 'recommend-topics',
        filters: { variables: { type: "parent", recommend: true, sort_by: 'sort:-1' } }
      });
    }

    // let topicId = cookie.load('topic_id') || '';

    this.setState({ isMount: true });

    // if (isMember) {
      // loadTips();
    // }
    
  }

  onClick(event, id) {
    event.preventDefault();

    /*
    cookie.save(
      'topic_id',
      id,
      {
        path: '/',
        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365)
      }
    );
    */

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

    const { isMount, expand, maxLenth } = this.state;
    const { topicId, topicList, isMember, hasNewFeed, hasNewSubscribe, hasNewExcellent, hasNewHome } = this.props;

    if (!topicList) return null;

    const { loading, data } = topicList;

    if (loading) return <div>loading...</div>;
    if (!data) return null;

    return (<div className="card">
      <div className="card-body" styleName="container">

        <div styleName="group">

          <div></div>

          <div>
            <Link to="/" styleName={topicId == '' ? 'active' : ''} onClick={e=>this.onClick(e, '')}>
              全部
              {isMount && hasNewHome && <span styleName="point"></span>}
            </Link>
            <Link to="/" styleName={topicId == 'excellent' ? 'active' : ''} onClick={e=>this.onClick(e, 'excellent')}>
              优选
              {isMount && hasNewExcellent && <span styleName="point"></span>}
            </Link>
            {isMember &&
            <Link to="/follow" styleName={topicId == 'follow' ? 'active' : ''} onClick={e=>this.onClick(e, 'follow')}>
              关注
              {/* 小红点只会在客户端显示，因此增加判断组件是否安装 */}
              {isMount && hasNewFeed && <span styleName="point"></span>}
            </Link>}
            {isMember &&
            <a href="javascript:void(0)" styleName={topicId == 'subscribe' ? 'active' : ''} onClick={e=>this.onClick(e, 'subscribe')}>
              收藏
              {isMount && hasNewSubscribe && <span styleName="point"></span>}
            </a>}
          </div>

        </div>

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
