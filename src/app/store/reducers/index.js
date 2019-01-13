import { combineReducers } from 'redux';

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
import captcha from './captcha';
import follow from './follow';
import reportTypes from './report-types';
import block from './block';
import feed from './feed';
import tips from './tips';

export default function() {

  // 这样处理的目的是，创建store的时候让 initialState 总计是返回新的，
  // 否则 initialState 的数据会持久化，下次创建的时候，初始的数据是之前的数据
  const states = {
    scroll: scroll(),
    user: user(),
    notification: notification(),
    people: people(),
    history: history(),
    topic: topic(),
    posts: posts(),
    comment: comment(),
    website: website(),
    countries: countries(),
    captcha: captcha(),
    follow: follow(),
    reportTypes: reportTypes(),
    block: block(),
    feed: feed(),
    tips: tips()
  }

  return combineReducers(states);
}
