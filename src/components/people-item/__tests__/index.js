import React from 'react'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'
import PeopleItem from '../index'
import FollowButton from '../../follow-people'

let people = {
  _id: 'test',
  nickname: 'test',
  fans_count: 1,
  posts_count: 1,
  comment_count: 0,
  avatar_url: '123'
}

describe('<PeopleItem />', function() {

  const wrapper = shallow(<PeopleItem people={people} />);

  it('应该有一个 `.item`', () => {
    expect(wrapper.find('.item').length).toBe(1);
  });

  it('应该有一个 `.follow`', () => {
    expect(wrapper.find('.follow').length).toBe(1);
  });

  it('应该有一个 `.load-demand`', () => {
    expect(wrapper.find('.load-demand').length).toBe(1);
  });

  it('应该含有nickname', function() {
    expect(wrapper.contains(<div>{people.nickname}</div>)).toBe(true);
  });

  it('应该渲染出粉丝数', function() {
    expect(wrapper.contains(<span>{people.fans_count}粉丝</span>)).toBe(true);
  });

  it('应该渲染出帖子数', function() {
    expect(wrapper.contains(<span>{people.posts_count}帖子</span>)).toBe(true);
  });

  it('应该不渲染评论数', function() {
    expect(wrapper.contains(<span>{people.comment_count}评论</span>)).toBe(false);
  });

});
