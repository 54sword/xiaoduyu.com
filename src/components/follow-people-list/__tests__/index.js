import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import FollowPeopleList from '../index'
import PeopleItem from '../../people-item'

import { signin } from '../../../actions/sign'
import { loadUserInfo } from '../../../actions/user'
import { loadFollowPeoples, loadFans } from '../../../actions/follow-people'


describe('<FollowPeopleList />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  let props = {
    name: 'index',
    filters: {},
    type: 'follow-people'
  }

  it('应该可以正常登录`', function() {
    const action = bindActionCreators(signin, dispatch)
    return action(testConfig.email, testConfig.password, (res, result)=>{
      expect(res).toEqual(true);
    })
  })

  it('应该可以获取用户的个人信息`', function() {
    const action = bindActionCreators(loadUserInfo, dispatch)
    return action({
      callback: (result)=>{

        props.filters = {
          people_id: result.data._id,
          people_exsits: 1
        }

        expect(result.success).toEqual(true);
      }
    })
  })

  it('应该可以获取到用户关注的人`', function() {
    const action = bindActionCreators(loadFollowPeoples, dispatch)
    return action({
      name: props.type + '-' + props.name,
      filters: props.filters,
      callback: (result) => {
        expect(result.success).toEqual(true);
      }
    })
  })

  it('应该包含 `.container` 和 若干个 `.item`', function() {

    var wrapper = mount(<Provider store={store}><FollowPeopleList {...props} /></Provider>)

    let length = store.getState().followPeople['follow-people-index'].data.length

    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find('.item').length).toBe(length);
  })

})
