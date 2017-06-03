import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Link } from 'react-router'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import Comment from '../index'
import styles from '../style.scss'

import { loadCommentById, loadCommentList } from '../../../actions/comment'
import { signin } from '../../../actions/sign'
import { loadUserInfo } from '../../../actions/user'

describe('<Comment />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  let props = {
    params: {
      id: ''
    }
  }

  let wrapper = null
  let comment = null
  let me = null

  it('应该可以正常登录', ()=>{
    const action = bindActionCreators(signin, dispatch)
    return action({ email: testConfig.email, password: testConfig.password }, (res, result)=>{
      expect(result.success).toEqual(true)
    })
  })

  it('应该可以获取到用户的信息', function() {
    const action = bindActionCreators(loadUserInfo, dispatch)
    return action({
      callback: (result)=> {
        me = result.data
        expect(result.success).toEqual(true)
      }
    })
  })

  it('应该可以获取评论`', function() {
    const action = bindActionCreators(loadCommentList, dispatch)
    return action({
      name: 'test',
      filters: { page:1, per_page: 1 },
      callback: (result) => {

        if (result && result.success) {
          comment = result.data[0]
          props.params.id = comment._id
        }

        expect(result && result.success ? true : false).toEqual(true);
      }
    })
  })

  it('应该有 帖子的标题', function() {
    if (!comment) return
    let posts = comment.posts_id
    wrapper = mount(<Provider store={store}><Comment {...props} /></Provider>)
    expect(wrapper.contains(<Link to={`/posts/${posts._id}`}>{posts.title}</Link>)).toBe(true);
  })

  it('应该有 作者链接', function() {
    if (!comment) return
    expect(wrapper.contains(<Link to={`/people/${comment.user_id._id}`}>
      <img className={styles.avatar} src={comment.user_id.avatar_url} />
      <b>{comment.user_id.nickname}</b>
    </Link>))
    .toBe(true);
  })

  it('应该有 回复链接', function() {
    if (!comment) return
    expect(wrapper.contains(<Link to={`/write-comment?posts_id=${comment.posts_id._id}&parent_id=${comment._id}`}>回复</Link>))
    .toBe(true);
  })

  it('应该有 编辑链接', function() {
    if (!comment) return
    expect(wrapper.contains(<Link to={`/edit-comment/${comment._id}`}>编辑</Link>))
    .toBe(me._id && comment.user_id._id ? true : false);
  })

})
