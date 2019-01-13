import React from 'react';
import { Link } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadCommentList } from '@actions/comment';
import { getCommentListById } from '@reducers/comment';
import { isMember } from '@reducers/user';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';
// import CommentList from '@components/comment/list';
import CommentList from '@modules/comment-list';
import HTMLText from '@components/html-text';
import EditorComment from '@components/editor-comment';
import Loading from '@components/ui/loading';

import SingleColumns from '../../layout/single-columns';

// styles
import './style.scss';

@Shell
@connect(
  (state, props) => ({
    isMember: isMember(state),
    list: getCommentListById(state, 'single_'+props.match.params.id)
  }),
  dispatch => ({
    loadList: bindActionCreators(loadCommentList, dispatch)
  })
)
export default class CommentDetail extends React.Component {

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
          },
          select: `
          content_html
          create_at
          reply_count
          like_count
          device
          _id
          update_at
          like
          user_id {
            _id
            nickname
            brief
            avatar_url
          }
          posts_id{
            _id
            title
            content_html
          }
          `
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

    return(<SingleColumns>
      <div></div>
      <div>

      <Meta title={`${comment.posts_id.title} - ${comment.user_id.nickname}的评论`} />

      <div styleName="title">
        <Link to={`/posts/${comment.posts_id._id}`}>
          <h1>{comment.posts_id.title}</h1>
        </Link>
        {comment.posts_id.content_html ? <HTMLText content={comment.posts_id.content_html} /> : null}
      </div>

      <div styleName="commennt-container">
        <div styleName="head">
          <img styleName="active" src={comment.user_id.avatar_url} />
          <div>
            <b>{comment.user_id.nickname}</b>
          </div>
          <div styleName="info">
            <span>{comment._create_at}</span>
            <span>{comment._device}</span>
          </div>
        </div>
        <div styleName="content">
          <HTMLText content={comment.content_html} />
        </div>
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
        <div styleName="editor">
          <EditorComment
            posts_id={comment.posts_id._id}
            parent_id={comment._id}
            reply_id={comment._id}
            placeholder={'回复 '+comment.user_id.nickname}
            />
        </div>
        : null}


    </div>


    </SingleColumns>)
  }

}
