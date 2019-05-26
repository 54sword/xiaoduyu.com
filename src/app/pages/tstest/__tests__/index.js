import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { StaticRouter } from 'react-router';
import { Provider } from 'react-redux'
import createStore from '../../../store';

import { TSTest } from '../index';

let store = createStore();

describe('<TSTest />', ()=>{

  let wrapper = '';

  it ('应该可以渲染组件',  () => {

    let props = {
      match: {
        params: { id: 'hello world' }
      }
    }

    wrapper = mount(<Provider store={store}>
      <StaticRouter context={{}}>
        <TSTest {...props} />
      </StaticRouter>
    </Provider>);

    // wrapper.setProps({
    //   match: {
    //     params: {
    //       test:'11',
    //       id: 'test22'
    //     }
    //   }
    // });

    // console.log(wrapper.text());

  });

  it('应该包含 [box]', () => {
    expect(wrapper.find('.box').length).toBe(1);    
  });
  
})
