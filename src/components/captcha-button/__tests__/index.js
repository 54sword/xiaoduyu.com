import React, { PropTypes } from 'react'
import { shallow, mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import configureStore from '../../../store/configureStore'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import CaptchaButton from '../index'

describe('<CaptchaButton />', ()=>{

  const store = configureStore({});

  const wrapper = mount(<Provider store={store}><CaptchaButton onClick={(d)=>{ d({ email: '54sword@gmail.com', type: 'reset-email' }); }} /></Provider>)

  it('should be selectable by class "button"', function() {
    expect(wrapper.text()).toEqual("获取验证码")
    // expect(wrapper.find('.captcha-button').length).toBe(1);
    // wrapper.find('a').simulate('click');
    // console.log(wrapper);
    // expect(wrapper.contains(<input type="submit" className="button captcha-button" />)).to.equal(true);
  })

})
