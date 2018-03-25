import React from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPostsList } from '../../actions/posts';
import { getPostsListByListId } from '../../reducers/posts';
import { isMember } from '../../reducers/user';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import Sidebar from '../../components/sidebar';
import CommentList from '../../components/comment/list';
import PostsList from '../../components/posts/list';
import PostsDetailC from '../../components/posts/detail';

import EditorComment from '../../components/editor-comment';

@connect(
  (state, props) => ({
    isMember: isMember(state),
    list: getPostsListByListId(state, props.match.params.id)
  }),
  dispatch => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch)
  })
)
export class PostsDetail extends React.Component {

  // 服务端渲染
  // 加载需要在服务端渲染的数据
  static loadData({ store, match }) {
    return new Promise(async (resolve, reject) => {

      const { id } = match.params;

      const [ err, data ] = await loadPostsList({
        id: id,
        filters: {
          variables: {
            _id: id,
            deleted: false,
            weaken: false
          }
        }
      })(store.dispatch, store.getState);

      // 没有找到帖子，设置页面 http code 为404
      if (err || data.length == 0) {
        resolve({ code:404 });
      } else {
        resolve({ code:200 });
      }

    })
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    const { id } = this.props.match.params;
    const { list, loadPostsList } = this.props;

    if (!list || !list.data) {
      this.props.loadPostsList({
        id,
        filters: {
          variables: {
            _id: id,
            deleted: false,
            weaken: false
          }
        }
      })
    }

  }

  render() {

    const { list, isMember } = this.props;
    const { loading, data } = list || {};
    const posts = data && data[0] ? data[0] : null;

    // 404 处理
    if (data && data.length == 0) {
      return '404 Not Found';
    }

    const { location } = this.props;

    return(<div>

      {loading ? <div>loading...</div> : null}

      <Meta title={posts ? posts.title : '加载中...'} />

      <div className="container">

      <div className="row">

        <div className="col-md-9">

          <PostsDetailC id={posts._id} />

          {/*posts ?
            <div className="jumbotron">
              <h1 className="h1">{posts.title}</h1>
              <p className="lead">{posts.topic_id.name}</p>
              <hr className="my-4" />
              {posts.content_html ?
                <div dangerouslySetInnerHTML={{__html:posts.content_html}} />
                : null}
            </div>
            : null*/}


            <CommentList
              name={posts._id}
              filters={{
                variables: {
                  posts_id: posts._id,
                  parent_id: false
                }
              }}
              // location={location}
              />
            {isMember ?
              <div className="mt-2">
                <EditorComment posts_id={posts._id} />
              </div>
              : null}
        </div>

        <div className="col-md-3">
          {posts ?
            <Sidebar
              recommendPostsDom={(<PostsList
                id={`sidebar-${posts._id}`}
                itemName="posts-item-title"
                // showPagination={false}
                filters={{
                  variables: {
                    sort_by: "comment_count,like_count,create_at",
                    deleted: false,
                    weaken: false,
                    page_size: 10,
                    topic_id: posts.topic_id._id,
                    start_create_at: (new Date().getTime() - 1000 * 60 * 60 * 24 * 7)+''
                  }
                }}
                />)}
              />
            : null}
        </div>

      </div>
      </div>

    </div>)
  }

}

export default Shell(PostsDetail);
