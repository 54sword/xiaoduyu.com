import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { StaticRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Provider } from 'react-redux'
import createStore from '../../../../store';

import { SignModal } from '../index';
import { loadCountries } from '../../../../store/actions/countries';
import { addCaptcha, getCaptcha } from '../../../../store/actions/captcha';

import To from '../../../../common/to';

let store = createStore();

describe('<SignModal />', ()=>{

  let wrapper,
      captchaId; // 验证码id

  it('应该可以获取 [国家数据]', async () => {
    let [err, res] = await To(loadCountries()(store.dispatch, store.getState));
    expect(res ? true : false).toBe(true);
  });

  it ('应该可以添加 [验证码]', async ()=>{

    let [ err, res ] = await To(addCaptcha({
      id: 'sign-in',
      args: {
        type: 'sign-in'
      },
      fields: `
        success
        _id
        url
      `
    })(store.dispatch, store.getState));
    
    wrapper = mount(<Provider store={store}>
      <StaticRouter context={{}}>
        <SignModal />
      </StaticRouter>
    </Provider>);

    if (res && res._id && res.url) {
      captchaId = res._id;
    }

    expect(res ? true : false).toBe(true);

  });

  it('应该包含链接 [忘记密码]', () => {
    expect(wrapper.find(Link).at(0).props().to).toBe('/forgot');
  });

  it('应该包含链接 [用户协议]', () => {
    expect(wrapper.find(Link).at(1).props().to).toBe('/agreement');
  });

  it('应该包含链接 [隐私政策]', () => {
    expect(wrapper.find(Link).at(2).props().to).toBe('/privacy');
  });

  it('应该包含 [登陆元素]', () => {
    expect(wrapper.find({ type: 'text', placeholder: '手机号/邮箱地址' }).length).toBe(1);
    expect(wrapper.find({ type: 'password', placeholder: '密码' }).length).toBe(1);
    expect(wrapper.find({ type: 'submit', value: '登录' }).length).toBe(1);
  });

  it('登陆应该成功 [账号登陆测试]', async () => {

    let err, res;

    // 如果有验证码，模拟输入验证码
    if (captchaId) {
      let [ error, result ] = await To(getCaptcha({ _id: captchaId })(store.dispatch, store.getState));
      let captcha = wrapper.find({ type: 'text', placeholder: '验证码' }).getDOMNode();
      captcha.value = result.captcha;
    }

    let accountInput = wrapper.find({ type: 'text', placeholder: '手机号/邮箱地址' }).getDOMNode();
    accountInput.value = 'apple.54sword@gmail.com';

    let passwordInput = wrapper.find({ type: 'password', placeholder: '密码' }).getDOMNode();
    passwordInput.value = '123456';
    
    // 模拟登陆
    [err, res] = await To(wrapper.find('form').at(0).props().onSubmit());

    expect(res && res.access_token ? true : false).toBe(true);
  });

  it('登陆应该失败 [无效账号登陆测试]', async () => {

    let accountInput = wrapper.find({ type: 'text', placeholder: '手机号/邮箱地址' }).getDOMNode();
    accountInput.value = 'test@test.com';

    let passwordInput = wrapper.find({ type: 'password', placeholder: '密码' }).getDOMNode();
    passwordInput.value = 'password';

    // 模拟登陆
    let [err, res] = await To(wrapper.find('form').at(0).props().onSubmit());
    
    expect(err ? true : false).toBe(true);
  });

  it('应该包含 [注册元素]', () => {

    // 模拟点击注册按钮
    wrapper.find('a').filter({children:'注册'}).simulate('click');

    expect(wrapper.find({ type: 'text', placeholder: '名字' }).length).toBe(1);
    expect(wrapper.find({ type: 'text', placeholder: '手机号' }).length).toBe(1);
    expect(wrapper.find({ type: 'text', placeholder: '输入 6 位验证码' }).length).toBe(1);
    expect(wrapper.find({ type: 'password', placeholder: '密码' }).length).toBe(1);
    expect(wrapper.find({ type: 'radio', value: '男' }).length).toBe(1);
    expect(wrapper.find({ type: 'radio', value: '女' }).length).toBe(1);
    expect(wrapper.find({ type: 'submit', value: '注册' }).length).toBe(1);

    // console.log(wrapper.html());
    
  });

  /*
  it('应该包含 [注册元素]', async () => {

    // console.log(wrapper.html());

    let phoneNumber = '18600000000';

    let phone = wrapper.find({ type: 'text', placeholder: '手机号' }).getDOMNode();
    phone.value = phoneNumber;

    wrapper.find('a').filter({ children: '获取验证码' }).simulate('click');
    
    // 延迟半秒查询
    await new Promise(resolve=>{
      setTimeout(() => {
        resolve();
      }, 500);
    });

    let [ err, res ] = await To(getCaptcha({ phone: phoneNumber })(store.dispatch, store.getState));

    let nickname = wrapper.find({ type: 'text', placeholder: '名字' }).getDOMNode();
    nickname.value = 'nickname';

    let gender = wrapper.find({ type: 'radio', value: '男' });
    // gender.simulate('click');
    gender.getDOMNode().checked = true;

    // console.log(gender.getDOMNode().checked);
    
    let password = wrapper.find({ type: 'password', placeholder: '密码' }).getDOMNode();
    password.value = 'password';

    let captcha = wrapper.find({ type: 'text', placeholder: '输入 6 位验证码' }).getDOMNode();
    captcha.value = res.captcha;

    [err, res] = await wrapper.find({ type: 'submit', value: '注册' }).simulate('click');

    // console.log(err);
    // console.log(res);

  });
  */

})
