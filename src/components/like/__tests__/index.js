import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import { LikeButton } from '../index'

describe('<LikeButton />', ()=>{

  let props = {
    comment: {
      like: false
    },
    isSignin: false,
    showSign: () => {},
    like: () => {},
    unlike: () => {}
  }

  it('应该没有赞按钮', function() {
    const wrapper = shallow(<LikeButton {...props} />)
    expect(wrapper.contains(<span></span>)).toBe(true);
  })

  it('应该有赞按钮', function() {

    props.isSignin = true

    const wrapper = shallow(<LikeButton {...props} />)

    const { reply, comment } = props
    const { like } = comment || reply

    expect(wrapper.contains(<a
      href="javascript:void(0)"
      className={like ? 'black-10' : ''}
      onClick={wrapper.node.props.onClick}>
      {like ? "已赞" : '赞'}
      </a>)).toBe(true);
  })

  it('应该有已赞按钮', function() {

    props.comment.like = true

    const wrapper = shallow(<LikeButton {...props} />)

    const { reply, comment } = props
    const { like } = comment || reply

    expect(wrapper.contains(<a
      href="javascript:void(0)"
      className={like ? 'black-10' : ''}
      onClick={wrapper.node.props.onClick}>
      {like ? "已赞" : '赞'}
      </a>)).toBe(true);
  })

})
