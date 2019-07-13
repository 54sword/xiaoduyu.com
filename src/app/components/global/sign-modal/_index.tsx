import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount, render } from 'enzyme';
import { StaticRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Provider } from 'react-redux'
import createStore from '../../../../redux';

import SignModal from '../index';
import { loadCountries } from '../../../../redux/actions/countries';
import { addCaptcha, getCaptcha } from '../../../../redux/actions/captcha';

import To from '../../../../common/to';

let store = createStore();

describe('<SignModal />', ()=>{

  let wrapper: any,
      captchaId: number; // 验证码id

  let phoneNumber = '18600000000',
      password = '123456',
      nickname = 'test';
  
  it('应该可以渲染 [登录与注册页面]', async () => {
    wrapper = mount(<Provider store={store}>
      <StaticRouter context={{}}>
        <SignModal />
      </StaticRouter>
    </Provider>);

    expect(wrapper ? true : false).toBe(true);
  });

  it('应该可以获取 [国家数据]', async () => {

    wrapper.find('a').filter({children:'注册'}).simulate('click');

    // console.log(wrapper);

    await new Promise(resolve=>{
      setTimeout(() => {
        resolve();
      }, 1000);
    });    

    console.log(wrapper.html());
    
    console.log(wrapper.find('option').length);

    // value="+86"

    // wrapper.update();

    // expect(wrapper.find({ value: '+86' }).length).toBe(1);
    // expect(wrapper.find({ value: '+1' }).length).toBe(1);

    

    // let [err, res] = await To(loadCountries()(store.dispatch, store.getState));
    // expect(res ? true : false).toBe(true);
  });

  // it('应该可以获取 [国家数据]', async () => {
  //   let [err, res] = await To(loadCountries()(store.dispatch, store.getState));
  //   expect(res ? true : false).toBe(true);
  // });
  
  /*
  it('应该登陆失败 [无效账号登陆测试]', async () => {

    // console.log(wrapper.html());

    let accountInput = wrapper.find({ type: 'text', placeholder: '手机号/邮箱地址' }).getDOMNode();
    accountInput.value = 'test@test.com';

    let passwordInput = wrapper.find({ type: 'password', placeholder: '密码' }).getDOMNode();
    passwordInput.value = 'password';

    // 模拟登陆
    let [err, res] = await To(wrapper.find('form').at(0).props().onSubmit());
    
    // console.log(err);
    // console.log(res);
    
    expect(err ? true : false).toBe(true);
  });
  */
  
  /*
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

  
  it('应该注册成功 [手机号注册]', async () => {

    // 页面中选择手机区号，需要一些更新，等待给予它一些等待的时间
    // await new Promise(resolve=>{
    //   setTimeout(() => {
    //     resolve();
    //   }, 500);
    // });

    // wrapper.update();    

    let nickname = wrapper.find({ type: 'text', placeholder: '名字' }).getDOMNode();
    nickname.value = nickname;

    let phone = wrapper.find({ type: 'text', placeholder: '手机号' }).getDOMNode();
    phone.value = phoneNumber;

    // wrapper.find('select')[0].simulate('click');
    // act(() => {
      // button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      wrapper.find('a').filter({ children: '获取验证码' }).simulate('click');
    // });
    
    // 延迟半秒查询
    // await new Promise(resolve=>{
    //   setTimeout(() => {
    //     resolve();
    //   }, 500);
    // });

    let [ err, res ] = await To(getCaptcha({ phone: phoneNumber })(store.dispatch, store.getState));

    let gender = wrapper.find({ type: 'radio', value: '男' });
    gender.getDOMNode().checked = true;
    
    let $password = wrapper.find({ type: 'password', placeholder: '密码' }).getDOMNode();
    $password.value = password;

    let captcha = wrapper.find({ type: 'text', placeholder: '输入 6 位验证码' }).getDOMNode();

    captcha.value = res.captcha;

    [err, res] = await To(wrapper.find('form').at(0).props().onSubmit());

    expect(err ? false : true).toBe(true);
  });
  
  it('应该包含链接 [忘记密码]', () => {
    wrapper.find('a').filter({children:'登录'}).simulate('click');
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
  

  
  it ('应该可以添加 [验证码]', async () => {

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

    // console.log(err);
    // console.log(res);

    if (res && res._id && res.url) {
      captchaId = res._id;
    }

    // console.log(wrapper.html());

    // 更新redux后，需要更新一下页面
    // wrapper.update();

    expect(res ? true : false).toBe(true);

  });
  


  
  it('应该登陆成功 [账号登陆测试]', async () => {

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
    
    // console.log(err);
    // console.log(res);
    // console.log(wrapper.html());

    if (res && res._id && res.url) {
      captchaId = res._id;
    }

    // 更新redux后，需要更新一下页面
    wrapper.update();

    // 延迟半秒查询
    // await new Promise(resolve=>{
    //   setTimeout(() => {
    //     resolve();
    //   }, 500);
    // });

    // let err, res;

    // 如果有验证码，模拟输入验证码
    if (captchaId) {
      let [ error, result ] = await To(getCaptcha({ _id: captchaId })(store.dispatch, store.getState));
      let captcha = wrapper.find({ type: 'text', placeholder: '验证码' }).getDOMNode();
      captcha.value = result.captcha;
    }

    let accountInput = wrapper.find({ type: 'text', placeholder: '手机号/邮箱地址' }).getDOMNode();
    accountInput.value = phoneNumber;

    let passwordInput = wrapper.find({ type: 'password', placeholder: '密码' }).getDOMNode();
    passwordInput.value = password;
    
    // 模拟登陆
    [err, res] = await To(wrapper.find('form').at(0).props().onSubmit());

    expect(res && res.access_token ? true : false).toBe(true);
  });
  */
  

})
