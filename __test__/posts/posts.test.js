import React from 'react'
// import renderer from 'react-test-renderer'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { BrowserRouter } from 'react-router-dom';
import Enzyme from '../../config/unit_test/Enzyme.config.js'
import PostsList from '../../src/components/posts/list';

const { shallow, mount } = Enzyme;

describe('>>>posts --- Mount REACT COMPONENTS',()=>{
    let wrapper, store;
    const general = {
      variables: {
        sort_by: "sort_by_date",
        deleted: false,
        weaken: false
      }
    };
    const postsList = {
      data: [],
      loading: false,
      more: false,
      count: 0,
      filters: general
    }
    let initialState = {
      user: {},
      posts: {
        home: postsList
      }
    }
    let mockStore = configureStore(initialState)

    beforeEach(()=>{
      store = mockStore(initialState);
      wrapper = mount(
        <Provider store={store}>
          <BrowserRouter>
            <PostsList id={'home'} filters={general} scrollLoad={false} />
          </BrowserRouter>
        </Provider>
      );
    })

    it('+++ render the DUMB component', () => {
        expect(wrapper.length).toEqual(1);
    });
});
