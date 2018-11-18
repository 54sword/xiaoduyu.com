import React, { Component } from 'react';
import Modal from '../../bootstrap/modal';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadCommentList } from '../../../store/actions/comment';
import { getCommentListById } from '../../../store/reducers/comment';
import { isMember } from '../../../store/reducers/user';

// style
// import CSSModules from 'react-css-modules';
// import styles from './style.scss';

import CommentDetail from '../detail';
import CommentList from '../list';

import EditorComment from '../../editor-comment';

@connect(
  (state, props) => ({
    isMember: isMember(state),
    getListById: id => getCommentListById(state, id)
  }),
  dispatch => ({
    loadList: bindActionCreators(loadCommentList, dispatch)
  })
)
export default class PostsModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      commentId: null
    }
  }

  componentDidMount () {

    $(`#comment-modal`).on('show.bs.modal', async (e) => {
      const { commentId } = e.relatedTarget;

      const { getListById, loadList } = this.props;

      let comment = getListById('single_'+commentId);

      if (comment.data && comment.data.length > 0) {

      } else {
        await loadList({
          name:'single_'+commentId,
          filters: {
            variables: {
              _id: commentId,
              deleted: false,
              weaken: false
            }
          }
        });

      }

      // await loadList(id);

      this.setState({ commentId });
    });

  }

  render () {
    const { commentId } = this.state;
    const { getListById, isMember } = this.props;

    let { data = [] } = getListById('single_'+commentId);

    let comment = data[0] || null;

    // console.log(comment);

    return (<div>
      <Modal
        id="comment-modal"
        position="top"
        size="max"
        title={'评论'}
        body={<div>
          {comment ? <CommentDetail comment={comment} /> : null}
          {comment ?
            <CommentList
              name={comment._id}
              filters={{
                variables: {
                  parent_id: comment._id,
                  page_size:100
                }
              }}
              />
            : <div>loading...</div>}

          {isMember && comment ?
            <div className="mt-2 mb-4">
              <EditorComment
                posts_id={comment.posts_id._id}
                parent_id={comment._id}
                reply_id={comment._id}
                placeholder={'回复 '+comment.user_id.nickname}
                />
            </div>
            : null}

        </div>}
        />
    </div>)

  }
}
