import { dateDiff } from '../../common/date';
import loadList from '../utils/new-graphql-load-list';

export const loadPeopleList = loadList({
  reducerName: 'people',
  actionType: 'SET_PEOPLE_LIST_BY_ID',
  api: 'users',
  fields: `
    _id
    nickname_reset_at
    create_at
    last_sign_at
    blocked
    role
    avatar
    brief
    source
    posts_count
    comment_count
    fans_count
    like_count
    follow_people_count
    follow_topic_count
    follow_posts_count
    block_people_count
    block_posts_count
    access_token
    gender
    nickname
    banned_to_post
    avatar_url
    follow
    user_cover
  `,
  processList: (list: Array<any>)=>{

    list.map((posts)=>{
      posts._last_sign_at = dateDiff(posts.last_sign_at)
      posts._create_at = dateDiff(posts.create_at)
      posts._nickname_reset_at = dateDiff(posts.nickname_reset_at)
      posts._create_at = dateDiff(posts.create_at)
    })

    return list
  }
});