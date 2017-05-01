import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Link } from 'react-router'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import TopicItem from '../index'
import FollowTopic from '../components/follow'
import styles from '../style.scss'

import { loadTopics } from '../../../actions/topic'
import { signin } from '../../../actions/sign'
import { loadUserInfo } from '../../../actions/user'

describe('<TopicItem />', function() {

  const store = configureStore()
  const { dispatch } = store

  let wrapper = null
  let topic = null
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

  it('应该可以获取到一条话题数据', ()=>{
    const action = bindActionCreators(loadTopics, dispatch)
    return action({
      name: 'test',
      filters: { per_page:1 },
      callback: (result) => {
        topic = result.data[0]
        expect(result.success).toEqual(true);
      }
    })
  })

  it('应该可以渲染出话题', ()=>{
    wrapper = mount(<Provider store={store}><TopicItem topic={topic} /></Provider>)
    expect(wrapper.find('.item').length).toBe(1)
  })

  /*
  it('应该有 提问链接', ()=>{
    expect(wrapper.contains(<Link to={`/write-posts/${topic._id}?type=2`}>提问</Link>)).toBe(true)
  })

  it('应该有 分享链接', ()=>{
    expect(wrapper.contains(<Link to={`/write-posts/${topic._id}?type=1`}>分享</Link>)).toBe(true)
  })
  */

  it('应该有／没有 编辑链接', ()=>{
    expect(wrapper.contains(<Link to={`/edit-topic/${topic._id}`}>编辑</Link>)).toBe(me.role == 100 ? true : false)
  })

  it('应该有 关注组件', ()=>{
    expect(wrapper.contains(<FollowTopic topic={topic} />)).toBe(true)
  })

  it('应该有 话题链接', ()=>{
    expect(wrapper.contains(<Link to={`/topics/${topic._id}`} className={styles.name}>
      <i className="load-demand" data-load-demand={`<img class=${styles.avatar} src=${topic.avatar} />`}></i>
      {topic.name}
    </Link>)).toBe(true)
  })

})
