import React from 'react';
import { Link } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadCommentList } from '../../actions/comment';
import { getCommentListById } from '../../reducers/comment';
import { isMember } from '../../reducers/user';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import Sidebar from '../../components/sidebar';
import CommentList from '../../components/comment/list';
// import PostsList from '../../components/posts/list';
// import PostsDetailC from '../../components/posts/detail';
import HTMLText from '../../components/html-text';
import EditorComment from '../../components/editor-comment';
import Loading from '../../components/ui/loading';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
    isMember: isMember(state),
    list: getCommentListById(state, 'single_'+props.match.params.id)
  }),
  dispatch => ({
    loadList: bindActionCreators(loadCommentList, dispatch)
  })
)
@CSSModules(styles)
export class CommentDetail extends React.Component {

  /*
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
  */

  constructor(props) {
    super(props);
  }

  async componentDidMount() {

    const { id } = this.props.match.params;

    const { list, loadList, notFoundPgae } = this.props;

    if (!list || !list.data) {
      let [ err, res ] = await this.props.loadList({
        name:'single_'+id,
        filters: {
          variables: {
            _id: id,
            deleted: false,
            weaken: false
          }
        }
      });

      if (err || res && res.data && !res.data[0]) {
        notFoundPgae('该帖子不存在');
      }

    }


  }

  render() {

    const { list, isMember } = this.props;
    const { loading, data } = list || {};
    const comment = data && data[0] ? data[0] : null;

    const { id } = this.props.match.params;

    // 404 处理
    // if (data && data.length == 0) {
      // return '404 Not Found';
    // }

    if (loading || !comment) {
      return <Loading />
    }

    return(<div>

      {<Meta title={comment ? comment.posts_id.title : '加载中...'} />}

      <div styleName="title">
        <Link to={`/posts/${comment.posts_id._id}`}>
          <h1>{comment.posts_id.title}</h1>
        </Link>
      </div>
      
      <div styleName="content">
        <HTMLText content={comment.content_html} />
      </div>

      <div styleName="comment-list">
        <CommentList
          name={id}
          filters={{
            variables: {
              parent_id: id,
              page_size:100
            }
          }}
          />
      </div>

      {isMember ?
        <div className="mt-2 mb-4">
          <EditorComment
            posts_id={comment.posts_id._id}
            parent_id={comment._id}
            reply_id={comment._id}
            />
        </div>
        : null}


    </div>)
  }

}

export default Shell(CommentDetail);
