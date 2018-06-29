import { DateDiff } from '../common/date';
import loadList from '../common/graphql-load-list';//'./common/new-load-list';

export function loadPeopleList({ name, filters = {}, restart = false, accessToken = '' }) {
  return (dispatch, getState) => {

    let _filters = Object.assign(filters, {})

    if (!_filters.select) {
      _filters.select = `
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
      `
    }

    return loadList({
      dispatch,
      getState,

      accessToken,

      name,
      restart,
      filters: _filters,

      processList: (list)=>{

        // console.log(list);

        list.map((posts)=>{
          posts._last_sign_at = DateDiff(posts.last_sign_at)
          posts._create_at = DateDiff(posts.create_at)
          posts._nickname_reset_at = DateDiff(posts.nickname_reset_at)
        })

        return list
      },

      schemaName: 'users',
      reducerName: 'people',
      api: '/people',
      actionType: 'SET_PEOPLE_LIST_BY_NAME'
    })
  }
}
