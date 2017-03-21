import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { shallow, mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import configureStore from '../../../store/configureStore'
import { bindActionCreators } from 'redux'
import testConfig from '../../../../config/test'


// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

// import { DateDiff } from '../../../common/date'

import { loadCommentList } from '../../../actions/comment'
import { signin } from '../../../actions/sign'

import CommentList from '../index'
// import { CommentList } from '../index'
import CommentItem from '../../comment-item'
// import styles from '../style.scss'

let props = {
  name: 'index',
  filters: { per_page:5, parent_exists:0, posts_id: '58b52ab6e4a8164839c1217c' }
}

describe('<CommentList />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  // it('应该可以正常登录`', function() {
  //   const _signin = bindActionCreators(signin, dispatch)
  //   return _signin(testConfig.email, testConfig.password, (res, result)=>{
  //     expect(res).toEqual(true);
  //   })
  // })

  it('应该有 可以正常获取到 comments 数据`', function() {

    const action = bindActionCreators(loadCommentList, dispatch)

    return action({
      name: props.name,
      filters: props.filters,
      callback: (result)=>{
        if (result.success) {
          var wrapper = mount(<Provider store={store}><CommentList {...props} /></Provider>)
          expect(wrapper.find('.comments').length).toBe(1);
          expect(wrapper.find(CommentItem).length).toBe(result.data.length);
        } else {
          expect(null).toEqual('没有查找到数据')
        }
      }
    })

  })



})
