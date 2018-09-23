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
import CommentList from '../../components/comment/list';
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

  // 服务端渲染
  // 加载需要在服务端渲染的数据
  static loadData({ store, match }) {
    return new Promise(async (resolve, reject) => {

      const { id } = match.params;

      const [ err, data ] = await loadCommentList({
        name: 'single_'+id,
        filters: {
          variables: {
            _id: id,
            deleted: false,
            weaken: false
          }
        }
      })(store.dispatch, store.getState);

      if (data && data.data && data.data.length > 0) {
        resolve({ code:200 });
      } else {
        resolve({ code:404, text: '该评论不存在' });
      }

    })
  }

  constructor(props) {
    super(props);
  }

  async componentDidMount() {

    const { id } = this.props.match.params;

    let { list, loadList, notFoundPgae } = this.props;
    let err;

    if (!list || !list.data) {

      [ err, list ] = await this.props.loadList({
        name:'single_'+id,
        filters: {
          variables: {
            _id: id,
            deleted: false,
            weaken: false
          }
        }
      });

    }

    if (list && list.data && !list.data[0]) {
      notFoundPgae('该评论不存在');
    }

  }

  render() {

    const { list, isMember } = this.props;
    const { loading, data } = list || {};
    const comment = data && data[0] ? data[0] : null;

    const { id } = this.props.match.params;

    if (loading || !comment) return <Loading />;

    return(<div>

      <Meta title={`${comment.posts_id.title} - ${comment.user_id.nickname}的评论`} />

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
            placeholder={'回复 '+comment.user_id.nickname}
            />
        </div>
        : null}


    </div>)
  }

}

export default Shell(CommentDetail);
