import React from 'react'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { BrowserRouter } from 'react-router-dom';
import Enzyme from '../../config/unit_test/Enzyme.config.js'

//test targets
import PostsList from '../../src/components/posts/list';
import * as action_posts from '../../src/store/actions/posts';
import reducer_posts from '../../src/store/reducers/posts';

//mock graphql request
jest.mock('../../src/common/graphql-load-list');

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
    const initialState = {
      user: {},
      posts: {
        home: postsList
      }
    }
    const middlewares = [ thunk ];
    const mockStore = configureStore(middlewares)

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

    it('+++ Components: render the with empty posts', () => {
        expect(wrapper.contains(<div className="text-center mt-4 md-4">没有查询到结果</div>)).toBe(true)
    });

    it('+++ Actions: load posts list', async () => {
      const expectedActions = [
        { type: 'SET_POSTS_LIST_BY_NAME', name: 'home', data: {}},
        { type: 'SET_POSTS_LIST_BY_NAME', name: 'home', data: {
          data: [ { _id: '123',
            name: 'MOCK_LOAD_POSTS',
            brief: 'MOCK_LOAD_POSTS',
            description: 'MOCK_LOAD_POSTS',
            avatar: '',
            background: '',
            follow_count: 0,
            posts_count: 0,
            comment_count: 0,
            sort: 100,
            create_at: '2017-01-28T15:08:36.323Z',
            language: 0,
            recommend: true,
            user_id: '123',
            follow: null,
            parent_id: null,
            children: [],
            _create_at: '2017-01-28' } ],
          filters:
           { sort_by: 'sort_by_date',
             deleted: false,
             weaken: false,
             page_number: 1,
             page_size: 25 },
          loading: false,
          count: 1,
          more: false
        }}
      ];

      return action_posts.loadPostsList({ id: "home", filters: JSON.parse(JSON.stringify(general)), restart: true })(store.dispatch, store.getState).then((res) => {
          expect(res[1].data[0].description).toEqual('MOCK_LOAD_POSTS');
          expect(store.getActions()[1]).toEqual(expectedActions[1]);
      });
    });

    it('+++ Reducers: load posts list', async () => {
      expect(reducer_posts()(store.getState().posts, { type: 'SET_POSTS_LIST_BY_NAME', name: 'home', data: {
        data: ["dummy"],
        loading: false,
        more: false,
        count: 1,
        filters: general
      }}).home.data.length).toEqual(1);
    });
});
