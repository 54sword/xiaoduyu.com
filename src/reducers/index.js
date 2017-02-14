import { combineReducers } from 'redux'

import scroll from './scroll'

// import questionList from './question-list'
// import answerList from './answer-list'
import sign from './sign'
import user from './user'
// import nodes from './nodes'
import notification from './notification'
import people from './people'
// import commentList from './comment-list'
import history from './history'
import followPeople from './follow-people'

import posts from './posts'
import topic from './topic'
import comment from './comment'

export default combineReducers({
  scroll,
  // questionList,
  // answerList,
  sign,
  user,
  // nodes,
  notification,
  people,
  // commentList,
  history,
  followPeople,

  topic,
  posts,
  comment
})
