
/**
 * 话题分类
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link, NavLink } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadTopics } from '../../store/actions/topic';
import { getTopicListByKey } from '../../store/reducers/topic';

// style
import './index.scss';

@withRouter
@connect(
  (state, props) => ({
    topicList: getTopicListByKey(state, 'head')
  }),
  dispatch => ({
    loadTopics: bindActionCreators(loadTopics, dispatch)
  })
)
export default class Box extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // 子话题显示长度
      maxLenth: 30,
      // 展开状态记录
      expand: {}
    }
  }

  componentDidMount() {

    const { topicList, loadTopics } = this.props;

    if (!topicList ||
        !topicList.data ||
        !topicList.data.length
    ) {
      loadTopics({
        id: 'head',
        filters: { variables: { type: "parent", recommend: true, sort_by: 'sort:-1' } }
      });
    }

  }

  handleExpand(id) {
    let { expand } = this.state;
    expand[id] = expand[id] ? false : true;
    this.setState({ expand });
  }

  render() {

    const { expand, maxLenth } = this.state;
    const { topicList } = this.props;

    if (!topicList) return null;

    const { loading, data } = topicList;

    if (loading) return <div>loading...</div>;
    if (!data) return;

    // 当前topic id
    let current = '';
    const path = this.props.match.path;

    if (path == '/topic/:id') {
      current = this.props.match.params.id;
    }

    return (<div className="card">
      <div className="card-body" styleName="container">

        <div styleName="group">
          <div>
            <NavLink exact to="/">全部</NavLink>
          </div>
        </div>

        <div styleName="group">
          <div>
            <NavLink exact to="/follow">关注</NavLink>
          </div>
        </div>

        {data.map(item=>{

          return (<div key={item._id} styleName="group">


            <div>
              <Link styleName={item._id == current ? 'active' : ''} to={`/topic/${item._id}`}>
                {item.name}
              </Link>
            </div>

            <div>
              {item.children && item.children.map((subitem, index)=>{
                if (!expand[item._id] && index > maxLenth) return;
                return (<Link
                  key={subitem._id}
                  styleName={subitem._id == current ? 'active' : ''}
                  to={`/topic/${subitem._id}`}
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
