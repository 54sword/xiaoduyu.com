import { combineReducers } from 'redux'

import scroll from './scroll'

import questionList from './question-list'
import answerList from './answer-list'
import sign from './sign'
import user from './user'
import nodes from './nodes'
import notification from './notification'
import people from './people'
import commentList from './comment-list'
import history from './history'

export default combineReducers({
  scroll,
  questionList,
  answerList,
  sign,
  user,
  nodes,
  notification,
  people,
  commentList,
  history
})
