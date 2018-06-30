import { combineReducers } from 'redux';

import merge from 'lodash/merge';

import scroll from './scroll';
import user from './user';
import notification from './notification';
import people from './people';
import history from './history';
import posts from './posts';
import topic from './topic';
import comment from './comment';
import website from './website';
import countries from './countries';
import analysis from './analysis';
import captcha from './captcha';
import follow from './follow';
import reportTypes from './report-types';
import block from './block';
import broadcast from './broadcast';

let states = {
  scroll,
  user,
  notification,
  people,
  history,
  topic,
  posts,
  comment,
  website,
  countries,
  analysis,
  captcha,
  follow,
  reportTypes,
  block,
  broadcast
}

let _states = {}

for (let i in states) {
  _states[i] = merge({}, states[i](), {});
}

_states = JSON.stringify(_states);

export default combineReducers(states);

export const initialStateJSON = _states;
