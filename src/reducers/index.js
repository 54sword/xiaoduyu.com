import { combineReducers } from 'redux'

import scroll from './scroll'
import sign from './sign'
import user from './user'
import notification from './notification'
import people from './people'
import history from './history'
import followPeople from './follow-people'
import posts from './posts'
import topic from './topic'
import comment from './comment'

export default combineReducers({
  scroll,
  sign,
  user,
  notification,
  people,
  history,
  followPeople,
  topic,
  posts,
  comment
})
