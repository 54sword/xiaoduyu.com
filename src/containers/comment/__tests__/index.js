import React, { PropTypes } from 'react'
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

import { loadCommentById } from '../../../actions/comment'
import { signin } from '../../../actions/sign'
import { loadUserInfo } from '../../../actions/user'

describe('<Comment />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  let props = {
    params: {
      id: '58b93bccd068dc3e713b5c0e'
    }
  }

  let wrapper = null
  let comment = null
  let me = null

  it('应该可以正常登录', ()=>{
    const action = bindActionCreators(signin, dispatch)
    return action(testConfig.email, testConfig.password, (res, result)=>{
      expect(res).toEqual(true)
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
    const action = bindActionCreators(loadCommentById, dispatch)
    return action({
      id: props.params.id,
      callback: (result) => {
        comment = result
        expect(result ? true : false).toEqual(true);
      }
    })
  })

  it('应该有 帖子的标题', function() {
    let posts = comment.posts_id
    wrapper = mount(<Provider store={store}><Comment {...props} /></Provider>)
    expect(wrapper.contains(<Link to={`/posts/${posts._id}`}>{posts.title}</Link>)).toBe(true);
  })

  it('应该有 作者链接', function() {
    expect(wrapper.contains(<Link to={`/people/${comment.user_id._id}`}>
      <img className={styles.avatar} src={comment.user_id.avatar_url} />
      {comment.user_id.nickname}
    </Link>))
    .toBe(true);
  })

  it('应该有 回复链接', function() {
    expect(wrapper.contains(<Link to={`/write-comment?posts_id=${comment.posts_id._id}&parent_id=${comment._id}`}>回复</Link>))
    .toBe(true);
  })

  it('应该有 编辑链接', function() {
    expect(wrapper.contains(<Link to={`/edit-comment/${comment._id}`}>编辑</Link>))
    .toBe(me._id && comment.user_id._id ? true : false);
  })

})
