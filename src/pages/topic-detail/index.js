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
// import PostsList from '../../components/posts/list';
import PostsList from '@modules/posts-list';
import Sidebar from '../../components/sidebar';
import Follow from '../../components/follow';
import Loading from '../../components/ui/loading';
import Box from '../../components/box';
import NewPostsButton from '../../components/new-posts-button';

// import SidebarTopic from '../../components/sidebar/topic';
import Topics from '@modules/topics';

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

      // console.log('123123');
      this.props = props;
      this.componentDidMount();
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

        {/* <Topics /> */}
        <div></div>

        <div>
          <div styleName="topic-info"  className="d-flex justify-content-between">
          <div>
            <div styleName="name">
              <img src={topic.avatar} />
              <Link to={`/topic/${topic._id}`}>{topic.name}</Link>
            </div>
            <div>{topic.brief}</div>
          </div>
        </div>

        <PostsList
          id={pathname + search}
          filters={general}
          scrollLoad={true}
          />

        </div>

      </Box>

    </div>)
  }

}
