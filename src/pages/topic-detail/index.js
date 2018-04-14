import React from 'react';

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
import Sidebar from '../../components/sidebar';

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

  let query = {
    sort_by: "create_at",
    deleted: false,
    weaken: false,
    page_size: 10,
    topic_id: topic.parent_id ? topic._id : topic.children
  }

  return {
    general: {
      query: Object.assign({}, query, search)
    },
    recommend: {
      query: Object.assign({}, query, {
        sort_by: "comment_count,like_count,create_at",
        page_size: 10
        // start_create_at: (new Date().getTime() - 1000 * 60 * 60 * 24 * 7) + ''
      })
    }
  }

}

@connect(
  (state, props) => {
    return {
      topicList: getTopicListByKey(state, props.match.params.id)
    }
  },
  dispatch => ({
    loadTopics: bindActionCreators(loadTopics, dispatch)
  })
)
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

        if (!general.topic_id) {
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
          new Promise(async resolve => {
            [ err, result ] = await loadPostsList({
              id: '_'+match.pathname,
              filters: recommend
            })(store.dispatch, store.getState);
            resolve([ err, result ])
          })
        ]).then(value=>{

          // console.log(value);
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

    if (topicList) return;

    loadTopics({
      id: id,
      filters: {
        variables: {
          _id: id
        }
      }
    });

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
      <div className="container">

      <div className="row">
        <div className="col-md-9">
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
    </div>)
  }

}

export default Shell(TopicsDetail);
