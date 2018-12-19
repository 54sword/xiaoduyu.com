import React, { Component } from 'react'

import Modal from '../bootstrap/modal'
import Editor from '../editor-comment'

export default class EditorCommentModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      reply: null
    }
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  componentDidMount() {
    const { show, hide } = this.props;
    show(this.show);
    hide(this.hide);
  }

  show(reply) {
    const self = this;
    this.setState({ show: true, reply }, ()=>{
      $(`#${reply._id}`).modal('show');
      $(`#${reply._id}`).on('hidden.bs.modal', function (e) {
        self.setState({ show: false });
      })
    });
  }

  hide() {
    const { reply } = this.state;
    $(`#${reply._id}`).modal('hide');
    this.setState({ show: false, reply: null });
  }

  render () {

    const self = this;
    const { show, reply } = this.state;

    if (!show) return '';

    let params = {
      displayControls: false,
      id: reply._id,
      posts_id: reply.posts_id._id || reply.posts_id,
      successCallback: self.hide,
      getEditor: (editor) => {
        setTimeout(()=>{
          editor.focus();
        }, 500)
      }
    }

    params.parent_id = reply.parent_id || reply._id;
    params.reply_id = reply._id;

    return (<div>
      <Modal id={reply._id} title={`回复 ${reply.user_id.nickname}`} body={<Editor {...params} />} />
    </div>)

  }
}
