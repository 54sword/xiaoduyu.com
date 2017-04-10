import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Link } from 'react-router'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import configureStore from '../../../store/configureStore'
import testConfig from '../../../../config/test'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import styles from '../style.scss'

import PostsItem from '../index'
import FollowPosts from '../../follow-posts'
import { loadPostsList } from '../../../actions/posts'

describe('<PostsItem />', ()=>{

  const store = configureStore()
  const { dispatch } = store

  let count = 0

  let props = {
    name: 'index',
    filters: { per_page: 1 }
  }

  let posts = null

  it('应该可以获取到一条帖子`', function() {
    const action = bindActionCreators(loadPostsList, dispatch)
    return action({
      name: 'index',
      filters: { per_page: 1 },
      callback: (result) => {
        posts = result.data[0]

        // console.log(posts);

        expect(result.success).toEqual(true);
      }
    })
  })

  it('应该包含 `.item`', function() {
    let wrapper = shallow(<PostsItem posts={posts} />)
    expect(wrapper.find('.item').length).toBe(1);
  })

  it('应该包含 `.comment-list`', function() {
    let wrapper = shallow(<PostsItem posts={posts} />)
    expect(wrapper.find('.comment-list').length).toBe(1);
  })

  it('应该包含 标题链接', function() {
    let wrapper = shallow(<PostsItem posts={posts} />)
    expect(wrapper.contains(<Link to={`/posts/${posts._id}`}>{posts.title}</Link>)).toBe(true);
  })

  it('应该包含 作者链接', function() {
    let wrapper = shallow(<PostsItem posts={posts} />)
    expect(wrapper.contains(<Link to={`/people/${posts.user_id._id}`}>
                    <i className={[styles.avatar + " load-demand"]} data-load-demand={`<img src=${posts.user_id.avatar_url} />`}></i>
                    {posts.user_id.nickname}
                  </Link>)).toBe(true);
  })

  it('应该包含 话题链接', function() {
    let wrapper = shallow(<PostsItem posts={posts} />)
    expect(wrapper.contains(<Link to={`/topics/${posts.topic_id._id}`}>{posts.topic_id.name}</Link>)).toBe(true);
  })

  it('应该包含 关注按钮', function() {
    let wrapper = shallow(<PostsItem posts={posts} />)
    expect(wrapper.contains(<FollowPosts posts={posts} />)).toBe(true);
  })

})
