import React from 'react'
import { Link } from 'react-router'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import configureStore from '../../../store/configureStore'
import { bindActionCreators } from 'redux'
import testConfig from '../../../../config/test'

import { loadCommentList } from '../../../actions/comment'
// import { signin } from '../../../actions/sign'

import { DateDiff } from '../../../common/date'

import { CommentItem } from '../index'
import LikeButton from '../../../components/like'
import styles from '../style.scss'


let props = {
  comment: {},
  me: {},
  showSign: ()=>{}
}

describe('<CommentItem />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  var comment = null

  it('应该有 可以正常获取到 comments 数据`', function() {
    const _loadCommentList = bindActionCreators(loadCommentList, dispatch)
    return _loadCommentList({
      name: 'index',
      filters: { per_page:1, parent_exists:0 },
      callback: (result)=>{
        if (result.success) {
          comment = result.data[0]
          props.comment = comment
          expect(result.success).toEqual(true)
        } else {
          expect(null).toEqual('没有查找到数据')
        }
      }
    })
  })

  it('应该没有  查看评论 `summary` 链接', function() {
    let wrapper = shallow(<CommentItem {...props} />)
    expect(wrapper.contains(<Link to={`/comment/${comment._id}`}>{comment.content_summary}</Link>)).toBe(false);
  })

  it('应该有 查看评论 `summary` 链接', function() {
    props.summary = true
    let wrapper = shallow(<CommentItem {...props} />)
    expect(wrapper.contains(<Link to={`/comment/${comment._id}`}>{comment.content_summary}</Link>)).toBe(true);
  })

  it('应该没有 回复链接', function() {
    props.displayReply = false
    let wrapper = shallow(<CommentItem {...props} />)
    expect(wrapper.contains(<span><Link to={`/write-comment?posts_id=${comment.posts_id && comment.posts_id._id ? comment.posts_id._id : comment.posts_id}&parent_id=${comment.parent_id ? comment.parent_id : comment._id}${comment.parent_id ? `&reply_id=${comment._id}` : ''}`}>回复</Link></span>)).toBe(false);
  })

  it('应该有 创建日期', function() {
    let wrapper = shallow(<CommentItem {...props} />)
    expect(wrapper.contains(<span>{DateDiff(comment.create_at)}</span>)).toBe(true);
  })

  it('应该没有 创建日期', function() {
    props.displayDate = false
    let wrapper = shallow(<CommentItem {...props} />)
    expect(wrapper.contains(<span>{DateDiff(comment.create_at)}</span>)).toBe(false);
  })

  // it('应该没有 赞', function() {
  //   let wrapper = shallow(<CommentItem {...props} />)
  //   expect(wrapper.contains(<LikeButton comment={!comment.parent_id ? comment : null} reply={comment.parent_id ? comment : null} />)).toBe(false);
  // })

  it('应该有 回复链接', function() {
    props.displayReply = true
    props.me._id = comment.user_id._id

    let wrapper = shallow(<CommentItem {...props} />)
    expect(wrapper.contains(<span><Link to={`/write-comment?posts_id=${comment.posts_id && comment.posts_id._id ? comment.posts_id._id : comment.posts_id}&parent_id=${comment.parent_id ? comment.parent_id : comment._id}${comment.parent_id ? `&reply_id=${comment._id}` : ''}`}>回复</Link></span>)).toBe(true);
  })

  it('应该有 赞', function() {
    let wrapper = shallow(<CommentItem {...props} />)
    expect(wrapper.contains(<LikeButton comment={!comment.parent_id ? comment : null} reply={comment.parent_id ? comment : null} />)).toBe(true);
  })

  it('应该有 编辑链接', function() {
    let wrapper = shallow(<CommentItem {...props} />)
    expect(wrapper.contains(<Link to={`/edit-comment/${comment._id}`}>编辑</Link>)).toBe(true);
  })

  it('应该没有 编辑链接', function() {
    props.me._id = '11'
    let wrapper = shallow(<CommentItem {...props} />)
    expect(wrapper.contains(<Link to={`/edit-comment/${comment._id}`}>编辑</Link>)).toBe(false);
  })

  it(`回复数量应该正确`, function() {
    let wrapper = shallow(<CommentItem {...props} />)
    expect(wrapper.find('.comment-list .item').length).toBe(comment.reply.length);
  })

})
