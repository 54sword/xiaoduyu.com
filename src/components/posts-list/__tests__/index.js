import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Link } from 'react-router'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import styles from '../style.scss'

import PostsList from '../index'
import { loadPostsList } from '../../../actions/posts'

describe('<PostsList />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  let props = {
    name: 'index',
    filters: { per_page: 10 }
  }

  let count = 0

  it('应该可以获取到10条帖子`', function() {
    const action = bindActionCreators(loadPostsList, dispatch)
    return action({
      name: props.name,
      filters: props.filters,
      callback: (result) => {
        count = result.data.length
        expect(result.success).toEqual(true);
      }
    })
  })

  it('应该可以渲染出帖子列表', ()=>{
    let wrapper = mount(<Provider store={store}><PostsList {...props} /></Provider>)
    expect(wrapper.find('.item .head').length).toBe(count);
  })

})
