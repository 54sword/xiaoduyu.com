import loadList from '../utils/new-graphql-load-list';

export const loadTopicList = loadList({
  reducerName: 'topic',
  actionType: 'SET_TOPIC_LIST_BY_ID',
  api: 'topics',
  fields: `
    _id
    name
    brief
    description
    avatar
    background
    follow_count
    posts_count
    comment_count
    sort
    create_at
    language
    recommend
    user_id
    follow
    parent_id {
      _id
      name
      brief
      avatar
    }
    children {
      _id
      name
      brief
      avatar
    }
  `
});
