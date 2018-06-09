import React from 'react';
import { Link } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadTopics } from '../../actions/topic';
import { loadPostsList } from '../../actions/posts';
import { getTopicListByKey } from '../../reducers/topic';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import PostsList from '../../components/posts/list';
// import Sidebar from '../../components/sidebar';
import NewPostsButton from '../../components/new-posts-button';
import Follow from '../../components/follow';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

/**
 * 分析url上面的参数
 * @param  {String} search location.search
 * @return {Object}        符合的参数对象
 */
const analyzeUrlParams = (search) => {

  let params = {};
  (search.split('?')[1] || '').split('&').map(item=>{
    let s = item.split('=');
    params[s[0]] = s[1];
  });

  let whiteParams = {}

  let whiteList = {
    // sort_by: (s)=>s,
    // recommend: (s)=>true,
    // deleted: (s)=>true,
    // weaken: (s)=>true,
    page_number: (s)=>parseInt(s)
    // page_size: (s)=>parseInt(s)
    // start_create_at: (s)=>s,
    // end_create_at: (s)=>s,
    // topic_id: (s)=>s,
    // user_id: (s)=>s,
    // _id: (s)=>s
  }

  for (let i in params) {
    if (whiteList[i]) whiteParams[i] = whiteList[i](params[i])
  }

  return whiteParams;
}

// 生成筛选对象
// *** 注意 ***
// 筛选参数每次都需要返回一个新对象，否则在相同页面切换的时候，筛选对象会指向同一个的问题
const generatePostsFilters = (topic, search) => {

  search = analyzeUrlParams(search);

  let childrenIds = [];

  if (topic.children) {
    topic.children.map(item=>{
      childrenIds.push(item._id);
    });
  }

  childrenIds = childrenIds.join(',');

  let query = {
    sort_by: "sort_by_date",
    deleted: false,
    weaken: false,
    page_size: 10,
    topic_id: topic.parent_id ? topic._id : childrenIds
  }

  return {
    general: {
      query: Object.assign({}, query, search)
    },
    recommend: {
      query: Object.assign({}, query, {
        sort_by: "comment_count,like_count,sort_by_date",
        page_size: 10,
        start_create_at: (new Date().getTime() - 1000 * 60 * 60 * 24 * 30) + ''
      })
    }
  }

}

@connect(
  (state, props) => {
    return {
      topicList: getTopicListByKey(state, props.match.params.id)
      // childTopicList: getTopicListByKey(state, props.match.params.id+'-children')
    }
  },
  dispatch => ({
    loadTopics: bindActionCreators(loadTopics, dispatch)
  })
)
@CSSModules(styles)
export class TopicsDetail extends React.Component {

  // 服务端渲染
  // 加载需要在服务端渲染的数据
  static loadData({ store, match }) {
    return new Promise(async (resolve, reject) => {

      const { id } = match.params;
      let err, result;

      [ err, result ] = await loadTopics({
        id: id,
        filters: { variables: { _id: id } }
      })(store.dispatch, store.getState);

      if (!err && result && result.data && result.data[0]) {

        let { general, recommend } = generatePostsFilters(result.data[0], match.search);

        if (!general.query.topic_id) {
          resolve({ code:200 });
          return
        }

        Promise.all([
          new Promise(async resolve => {
            [ err, result ] = await loadPostsList({
              id: match.pathname + match.search,
              filters: general
            })(store.dispatch, store.getState);
            resolve([ err, result ])
          }),
          /*
          new Promise(async resolve => {

            [ err, result ] = await loadTopics({
              id: id+'-children',
              filters: { variables: { parent_id: id } }
            })(store.dispatch, store.getState);

            resolve([ err, result ]);

            // [ err, result ] = await loadPostsList({
            //   id: '_'+match.pathname,
            //   filters: recommend
            // })(store.dispatch, store.getState);
            // resolve([ err, result ])
          })
          */
        ]).then(value=>{
          resolve({ code:200 });
        });

      } else {
        resolve({ code:404 });
      }

    })
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    const { topicList, loadTopics } = this.props
    const { id } = this.props.match.params

    if (!topicList) {
      loadTopics({
        id: id,
        filters: {
          variables: { _id: id }
        }
      });
    }

  }

  componentWillReceiveProps(props) {
    if (this.props.location.pathname + this.props.location.search != props.location.pathname + props.location.search) {
      this.props = props;
      this.componentDidMount();
      // window.scrollTo(0, 0);
    }
  }

  render() {

    const { id } = this.props.match.params;
    const { pathname, search } = this.props.location;
    const { topicList } = this.props;
    const topic = topicList && topicList.data[0] ? topicList.data[0] : null;

    if (!topic) return '';

    const { general, recommend } = generatePostsFilters(topic, search);

    // 如果是父话题，则查询该父节点下面所有的子节点
    if (!topic.parent_id && !topic.children) {
      return (<div>
        <Meta title={topic.name} />
        没有相关帖子
      </div>);
    }

    return(<div>

      <Meta title={topic.name} />

      {topic.parent_id ?
        <div styleName="topic-info">
          <img src={topic.avatar} styleName="avatar" />
          <div styleName="name">
            <Link to={`/topic/${topic.parent_id._id}`}>{topic.parent_id.name}</Link>
            {topic.name}
          </div>
          <div>{topic.brief}</div>
          <div styleName="status">
            {topic.posts_count ? <span>{topic.posts_count} 帖子</span> : null}
            {topic.comment_count ? <span>{topic.comment_count} 评论</span> : null}
            {topic.follow_count ? <span>{topic.follow_count} 关注</span> : null}
          </div>
          <div>
            <Follow topic={topic} />
          </div>
        </div>
        : null}

      {topic.children && topic.children.length > 0 ?
        <div styleName="topic-nav">
          {topic.children.map(item=>{
            return (<Link to={`/topic/${item._id}`} key={item._id}>
                <img src={item.avatar} />
                {item.name}
              </Link>)
          })}
        </div>
        : null}

      {topic.parent_id ?
        <NewPostsButton />
        : null}

      <PostsList
        id={pathname + search}
        filters={general}
        scrollLoad={true}
        />

      {/*
      <div className="container">

      <div className="row">
        <div className="col-md-9">
          <NewPostsButton />
          <PostsList
            id={pathname + search}
            filters={general}
            scrollLoad={true}
            />
        </div>
        <div className="col-md-3">
          <Sidebar
            recommendPostsDom={(<PostsList
              id={'_'+pathname}
              itemName="posts-item-title"
              filters={recommend} />)}
            />
        </div>
      </div>

      </div>
      */}
    </div>)
  }

}

export default Shell(TopicsDetail);
