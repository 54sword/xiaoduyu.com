import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import ListLoading from '../index'

import styles from '../style.scss'

describe('<ListLoading />', ()=>{

  it('应该有 正在加载', function() {

    const props = {
      loading: true,
      more: true
    }

    const wrapper = shallow(<ListLoading {...props} />)
    expect(wrapper.contains(<div className={styles.box}>正在加载...</div>)).toBe(true);
  })

  it('应该有 没有更多', function() {

    const props = {
      more: false
    }

    const wrapper = shallow(<ListLoading {...props} />)
    expect(wrapper.contains(<div className={styles.box}>没有更多</div>)).toBe(true);
  })

  it('应该有 点击加载更多', function() {

    const props = {
      loading: false,
      more: true,
      handleLoad: () => {}
    }

    const wrapper = shallow(<ListLoading {...props} />)

    expect(wrapper.contains(<a href="javascript:void(0)" onClick={props.handleLoad}>点击加载更多</a>)).toBe(true);
  })

})
