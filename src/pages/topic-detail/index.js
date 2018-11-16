import React from 'react';
import { Link } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadTopics } from '../../store/actions/topic';
import { loadPostsList } from '../../store/actions/posts';
import { getTopicListByKey } from '../../store/reducers/topic';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import PostsList from '../../components/posts/list';
import Sidebar from '../../components/sidebar';
// import NewPostsButton from '../../components/new-posts-button';
import Follow from '../../components/follow';
import Loading from '../../components/ui/loading';
import Box from '../../components/box';
import NewPostsButton from '../../components/new-posts-button';

// styles
// import CSSModules from 'react-css-modules';
import './style.scss';

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
        start_create_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30)
      })
    }
  }

}

@Shell
@connect(
  (state, props) => ({
    topicList: getTopicListByKey(state, props.match.params.id)
  }),
  dispatch => ({
    loadTopics: bindActionCreators(loadTopics, dispatch)
  })
)
export default class TopicsDetail extends React.Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {

    let { list, loadTopics, notFoundPgae } = this.props;
    const { id } = this.props.match.params;
    let err, res;

    if (!list || !list.data) {
      [ err, list ] = await loadTopics({
        id: id,
        filters: { variables: { _id: id } }
      });
    }

    if (list && list.data && !list.data[0]) {
      notFoundPgae('该话题不存在');
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
    const { loading } = topicList || {};

    if (loading || !topic) return (<Loading />);

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

      <Box>

        <div>
          
        {topic.parent_id ?
          <div styleName="topic-info"  className="d-flex justify-content-between">
            <div>
              <div styleName="name" className="load-demand" data-load-demand={encodeURIComponent(`<img src=${topic.avatar} />`)}>
                <Link to={`/topic/${topic.parent_id._id}`}>{topic.parent_id.name}</Link>
                {topic.name}
              </div>
              <div>{topic.brief}</div>
              <div styleName="status">
                {topic.posts_count ? <span>{topic.posts_count} 帖子</span> : null}
                {topic.comment_count ? <span>{topic.comment_count} 评论</span> : null}
                {topic.follow_count ? <span>{topic.follow_count} 关注</span> : null}
              </div>
            </div>
            <div styleName="actions">
              <Follow topic={topic} />
            </div>
          </div>
          : null}

        <NewPostsButton className="d-block d-md-block d-lg-none d-xl-none" />

        {topic.children && topic.children.length > 0 ?
          <div styleName="topic-nav">
            {topic.children.map(item=>{
              return (<Link to={`/topic/${item._id}`} key={item._id}>
                  {item.name}
                </Link>)
            })}
          </div>
          : null}

          <PostsList
            id={pathname + search}
            filters={general}
            scrollLoad={true}
            />

        </div>

        <Sidebar
          recommendPostsDom={(<PostsList
            id={'_'+pathname}
            itemName="posts-item-title"
            filters={recommend} />)}
          />

      </Box>

      {/*
      <div className="container">
        <div className="row">
          <div className="col-md-8">

      {topic.parent_id ?
        <div styleName="topic-info">
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


          </div>
          <div className="col-md-4">
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
