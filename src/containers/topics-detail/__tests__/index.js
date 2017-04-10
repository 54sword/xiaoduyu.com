import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import TopicDetail from '../index'
import TopicItem from '../../../components/topic-item'
import PostsList from '../../../components/posts-list'

import { loadTopics } from '../../../actions/topic'

describe('<TopicDetail />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  let props = {
    params: {
      id: ''
    }
  }

  let topic = null
  let wrapper = null

  it('应该可以获取到一条话题数据', ()=>{
    const action = bindActionCreators(loadTopics, dispatch)
    return action({
      name: 'test',
      filters: { per_page:1 },
      callback: (result) => {
        topic = result.data[0]
        props.params.id = topic._id
        expect(result.success).toEqual(true);
      }
    })
  })

  it('应该有相应个数的 帖子项', function() {
    wrapper = mount(<Provider store={store}><TopicDetail {...props} /></Provider>)
    expect(wrapper.contains(<TopicItem topic={topic} />)).toBe(true);
  })

  it('应该有相应个数的 帖子项', function() {
    expect(wrapper.contains(<PostsList
      name={`communities-${topic._id}`}
      filters={{ topic_id: topic._id }}
    />)).toBe(true);
  })

})
