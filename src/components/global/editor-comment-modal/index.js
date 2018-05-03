import React, { Component } from 'react'

import Modal from '../../bootstrap/modal'
import Editor from '../../editor-comment'

export default class EditorCommentModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalId: 'editor-comment-modal',
      show: false,
      comment: null,
      type: ''
    }
  }

  componentDidMount() {

    const self = this;
    const { modalId } = this.state;

    $('#'+modalId).on('show.bs.modal', function (e) {
      self.setState({
        show: true,
        comment: e.relatedTarget.comment,
        type: e.relatedTarget.type
      });
    });

    $('#'+modalId).on('hidden.bs.modal', function (e) {
      self.setState({
        show: false,
        comment: null,
        type: ''
      });
    });

  }


  render () {

    const self = this;
    const { show, type, comment, modalId } = this.state;

    if (!show) {
      return <Modal id={modalId} title="回复" body={''} />
    }

    let title = '回复';

    let params = {
      successCallback: ()=>{
        $('#'+modalId).modal('hide');
      },
      getEditor: editor => {
        setTimeout(()=>editor.focus(), 500)
      }
    }

    if (type == 'reply') {
      title = '回复';

      params = {
        ...params,
        id: comment._id,
        posts_id: comment.posts_id._id || comment.posts_id,
        parent_id: comment.parent_id || comment._id,
        reply_id: comment._id
      };

    } else if (type == 'edit') {
      title = '编辑';
      params = { ...params, ...comment };
    }

    return (<Modal id={modalId} title={title} body={<Editor {...params} />} />)

  }
}
