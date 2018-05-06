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
import countries from './countries'
import broadcast from './broadcast'
import analysis from './analysis'
import captcha from './captcha'
import postsTypes from './posts-types'
import follow from './follow'
import reportTypes from './report-types'

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
  countries,
  broadcast,
  analysis,
  captcha,
  postsTypes,
  follow,
  reportTypes
}

let _states = {}

for (let i in states) {
  _states[i] = merge({}, states[i](), {})
}

_states = JSON.stringify(_states)

export default combineReducers(states)

export const initialStateJSON = _states
