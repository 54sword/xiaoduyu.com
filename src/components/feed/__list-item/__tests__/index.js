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

  let stopPropagation = (e) => {
    e.stopPropagation();
  }

  it('应该可以获取到一条帖子`', function() {
    const action = bindActionCreators(loadPostsList, dispatch)
    return action({
      name: 'index',
      filters: { per_page: 1 },
      callback: (result) => {
        posts = result.data[0]
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
    expect(wrapper.find('.comment-list').length).toBe(posts.comment && posts.comment.length ? 1 : 0);
  })

  // it('应该包含 标题链接', function() {
  //   let wrapper = shallow(<PostsItem posts={posts} />)
  //   expect(wrapper.contains(<Link to={`/posts/${posts._id}`} ref="title" onClick={stopPropagation}>{posts.title}</Link>)).toBe(true);
  // })

  it('应该包含 作者链接 和 话题链接', function() {
    let wrapper = shallow(<PostsItem posts={posts} />)
    expect(wrapper.find('.info').length).toBe(1);
  })

/*
  it('应该包含 作者链接', function() {
    let wrapper = shallow(<PostsItem posts={posts} />)
    console.log(wrapper);
    expect(wrapper.contains(<Link to={`/people/${posts.user_id._id}`} onClick={stopPropagation}>
      <i
        className={[styles.avatar + " load-demand"]}
        data-load-demand={`<img src="${posts.user_id.avatar_url}" />`}>
        </i>
      <b>{posts.user_id.nickname}</b>
    </Link>)).toBe(true);
  })

  it('应该包含 话题链接', function() {
    let wrapper = shallow(<PostsItem posts={posts} />)
    expect(wrapper.contains(<Link to={`/topics/${posts.topic_id._id}`} onClick={stopPropagation}>{posts.topic_id.name}</Link>)).toBe(true);
  })
*/
  it('应该没有 关注按钮', function() {
    let wrapper = shallow(<PostsItem posts={posts} />)
    expect(wrapper.contains(<FollowPosts posts={posts} />)).toBe(false);
  })

  it('应该有 关注按钮', function() {
    let wrapper = shallow(<PostsItem posts={posts} displayFollow={true} />)
    expect(wrapper.contains(<FollowPosts posts={posts} />)).toBe(true);
  })

})
