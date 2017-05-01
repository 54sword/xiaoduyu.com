import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Link } from 'react-router'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import Me from '../index'
import styles from '../style.scss'

// import { loadCommentById } from '../../../actions/comment'
import { signin } from '../../../actions/sign'
import { loadUserInfo } from '../../../actions/user'

describe('<Comment />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  let wrapper = null
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

  it('应该有 设置链接', function() {
    wrapper = mount(<Provider store={store}><Me /></Provider>)
    expect(wrapper.contains(<Link to="/settings" className={styles.header}>
      <img src={me.avatar_url.replace('!50', "!100")} />
      <div>{me.nickname}</div>
    </Link>)).toBe(true);
  })

  it('应该有 我创建的帖子的标题', function() {
    expect(wrapper.contains(<Link className="arrow" to={`/people/${me._id}/posts`}>
      我创建的帖子 <span className="right">{me.posts_count}</span>
    </Link>)).toBe(true);
  })

  it('应该有 我编写的评论的标题', function() {
    expect(wrapper.contains(<Link className="arrow" to={`/people/${me._id}/comments`}>
      我编写的评论 <span className="right">{me.comment_total}</span>
    </Link>)).toBe(true);
  })

})
