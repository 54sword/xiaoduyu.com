import { combineReducers } from 'redux'

import merge from 'lodash/merge'

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
import website from './website'
import postsTypes from './posts-types'
import countries from './countries'

let states = {
  scroll,
  sign,
  user,
  notification,
  people,
  history,
  followPeople,
  topic,
  posts,
  comment,
  website,
  postsTypes,
  countries
}

let _states = {}

for (let i in states) {
  _states[i] = states[i]()
}


export default combineReducers(states)

export const getInitialState = () => {
  return merge({}, _states, {})
}
