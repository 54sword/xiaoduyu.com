// __tests__/hidden-message.js
// these imports are something you'd normally configure Jest to import for you
// automatically. Learn more in the setup docs: https://testing-library.com/docs/react-testing-library/setup#cleanup
// import '@testing-library/react/cleanup-after-each'
// import '@testing-library/jest-dom/extend-expect'
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import { act } from 'react-dom/test-utils';
// import HiddenMessage from '../hidden-message'
import SignModal from '../index';
import { StaticRouter } from 'react-router';
import { Provider } from 'react-redux'
// import jest from 'jest';

// console.log(jest);

import createStore from '../../../../redux';
let store = createStore();

import To from '../../../../common/to';

let container: any;

test('应该可以渲染 [登录与注册页面]', () => {

  // act(() => {
    container = render(
      <Provider store={store}>
        <StaticRouter context={{}}>
          <SignModal />
        </StaticRouter>
      </Provider>
    )
  // })


  
  // getByPlaceholderText('男');

  // query* functions will return the element or null if it cannot be found
  // get* functions will return the element or throw an error if it cannot be found
  // expect(queryByText(testMessage)).toBeNull()

  // the queries can accept a regex to make your selectors more resilient to content tweaks and changes.
  // fireEvent.click(getByLabelText(/show/i))

  // .toBeInTheDocument() is an assertion that comes from jest-dom
  // otherwise you could use .toBeDefined()
  // expect(getByText(testMessage)).toBeInTheDocument()
});

test('应该包含 [注册元素]', async () => {

  const { getByText, getByPlaceholderText, getByDisplayValue } = container;

  const aboutAnchorNode = getByText('注册');

  fireEvent.click(aboutAnchorNode);

  await new Promise(resolve=>{
    setTimeout(() => {
      resolve();
    }, 1000);
  });
  
  getByText('中国 +86');
  getByText('美国 +1');
  getByText('日本 +81');

  /*
  getByPlaceholderText('名字');
  getByPlaceholderText('手机号');
  getByPlaceholderText('输入 6 位验证码');
  getByPlaceholderText('密码');
  getByDisplayValue('男');
  getByDisplayValue('女');
  getByDisplayValue('注册');
  */

});

/*
test('应该登陆失败 [无效账号登陆测试]', async() => {

  const { getByText, getByPlaceholderText, getByDisplayValue } = container;

  // const aboutAnchorNode = getByText('注册')




  fireEvent.click(getByText('登录'));

  const $account = getByPlaceholderText('手机号/邮箱地址');
  const $password = getByPlaceholderText('密码');
  const $submit = getByDisplayValue('登录');

  $account.value = '18600000000';
  $password.value = '123456';

  jest.spyOn($submit, 'submit').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () => {
        console.log('======');
      },
    })
  })

  let result = await To(fireEvent.click($submit));

  console.log(result);

});
*/