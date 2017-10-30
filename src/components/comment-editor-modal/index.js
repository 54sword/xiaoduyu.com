import React, { Component } from 'react'
import Modal from '../modal'
import CommentEditor from '../comment-editor'

export class CommentEditorModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      posts_id: '',
      parent_id: '',
      reply_id: '',
      reply: null
    }
  }

  update({ posts_id, parent_id, reply_id, reply }) {
    this.setState({ posts_id, parent_id, reply_id, reply })
    this.show()
  }

  render () {

    const self = this
    const { show, hide } = this.props
    const { posts_id, parent_id, reply_id, reply } = this.state

    return (<Modal
        head={reply ? <div>回复 <b>{reply.user_id.nickname}</b></div> : null}
        body={<CommentEditor
              posts_id={posts_id}
              parent_id={parent_id}
              reply_id={reply_id}
              successCallback={()=>{ self.hide() }}
              />}
        show={(showFromChild)=>{
          self.show = showFromChild
          show((paramsFromParent)=>self.update(paramsFromParent))
        }}
        hide={(hideFromChild)=>{
          self.hide = hideFromChild
          hide(hideFromChild)
        }}
        closeButton={true}
        headStyle={{padding:15, borderBottom: '1px solid #efefef' }}
        bodyStyle={{padding:0}}
      />)
  }
}

CommentEditorModal.defaultProps = {
  show: ()=>{},
  hide: ()=>{}
}
export default CommentEditorModal
