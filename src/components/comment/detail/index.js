import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { loadCommentList } from '../../actions/comment';
// import { getCommentListById } from '../../reducers/comment';
import { isMember } from '../../../reducers/user';

// components
// import Shell from '../../components/shell';
// import Meta from '../../components/meta';
// import CommentList from '../../components/comment/list';
import HTMLText from '../../html-text';
// import EditorComment from '../../components/editor-comment';
import Loading from '../../ui/loading';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
    isMember: isMember(state),
    // list: getCommentListById(state, 'single_'+props.id)
  }),
  dispatch => ({
    // loadList: bindActionCreators(loadCommentList, dispatch)
  })
)
@CSSModules(styles)
export default class CommentDetail extends React.Component {

  static propTypes = {
    comment: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    /*
    const { id } = this.props.match.params;

    let { list, loadList } = this.props;
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
    */

    // if (list && list.data && !list.data[0]) {
      // notFoundPgae('该评论不存在');
    // }

  }

  render() {

    const { comment } = this.props;

    /*
    const { list, isMember } = this.props;
    const { loading, data } = list || {};
    const comment = data && data[0] ? data[0] : null;

    const { id } = this.props.match.params;

    if (loading || !comment) return <Loading />;
    */

    return(<div>

      {/*<Meta title={`${comment.posts_id.title} - ${comment.user_id.nickname}的评论`} />*/}

      {comment.posts_id ?
        <div styleName="title">
          <Link to={`/posts/${comment.posts_id._id}`}>
            <h1>{comment.posts_id.title}</h1>
          </Link>
        </div>
        : null}

      <div styleName="content">
        <HTMLText content={comment.content_html} />
      </div>

      {/*
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
      */}

      {/*isMember ?
        <div className="mt-2 mb-4">
          <EditorComment
            posts_id={comment.posts_id._id}
            parent_id={comment._id}
            reply_id={comment._id}
            placeholder={'回复 '+comment.user_id.nickname}
            />
        </div>
        : null*/}


    </div>)
  }

}
