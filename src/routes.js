import React from 'react'
import { Route, Router, Redirect, IndexRoute } from 'react-router'

import Home from './containers/home/'
import Topics from './containers/topics'
import TopicsDetail from './containers/topics-detail'
import WriteTopic from './containers/write-topic'
import EditTopic from './containers/edit-topic'
import AllTopics from './containers/all-topics'

import Notifications from './containers/notifications'

import Forgot from './containers/forgot'

import Me from './containers/me'
import ImproveProfile from './containers/improve-profile'
import Settings from './containers/settings'
import SettingsNickname from './containers/reset-nickname'
import SettingsGender from './containers/reset-gender'
import SettingsBrief from './containers/reset-brief'
import SettingsPassword from './containers/reset-password'
import SettingsAvatar from './containers/reset-avatar'
import SettingsEmail from './containers/reset-email'
import BindingEmail from './containers/binding-email'

import PostsDetaill from './containers/posts-detail'
import WritePosts from './containers/write-posts'
import EditPosts from './containers/edit-posts'

import CommentDetail from './containers/comment-detail'
import WriteComment from './containers/write-comment'
import EditComment from './containers/edit-comment'

import People from './containers/people'
import PoeplePosts from './containers/people/components/posts'
import PoepleComment from './containers/people/components/comments'
import PoepleTopic from './containers/people/components/topics'
import PoepleFollowing from './containers/people/components/following'
import PoepleFans from './containers/people/components/fans'
import PoepleFollowPosts from './containers/people/components/follow-posts'

import Oauth from './containers/oauth'
import OauthBinding from './containers/oauth-binding'

import Notice from './containers/notice'
import NotFound from './containers/not-found'
import Privacy from './containers/privacy'

export default (history, user, logPageView = ()=>{}) =>{

  // 检查个人资料是否完整，
  const checkProfile = (nextState, replaceState) => {
    if (user && user.nickname == '') {
      return false
    }
    return true
  }

  // 验证是否登录
  const requireAuth = (nextState, replaceState) => {

    if (!user) {
      return replaceState({
        pathname: '/',
        query: {},
        state: { nextPathname: nextState.location.pathname }
      })
    }

    if (user && !checkProfile(user) &&
      nextState.location.pathname != '/improve-profile' &&
      nextState.location.pathname != '/settings/nickname' &&
      nextState.location.pathname != '/settings/avatar'
      ) {
      return replaceState({
        pathname: '/improve-profile',
        query: {},
        state: { nextPathname: nextState.location.pathname }
      })
    }

  }

  const requireAuthAdmin = (nextState, replaceState) => {

    if (!user || user.role !== 100) {
      return replaceState({
        pathname: '/',
        query: {},
        state: { nextPathname: nextState.location.pathname }
      })
    }

  }

  const triggerEnter = (nextState, replaceState) => {

    if (user && !checkProfile(user) &&
      nextState.location.pathname != '/improve-profile' &&
      nextState.location.pathname != '/settings/nickname' &&
      nextState.location.pathname != '/settings/avatar'
    ) {
      return replaceState({
        pathname: '/improve-profile',
        query: {},
        state: { nextPathname: nextState.location.pathname }
      })
    }

  }
  const triggerLeave = (nextState, replaceState) => {}

  return (<Router history={history} onUpdate={logPageView}>
    <Route path="/" component={Home} onLeave={triggerLeave} onEnter={triggerEnter} />
    <Route path="/notifications" component={Notifications} onLeave={triggerLeave} onEnter={requireAuth} />

    <Route path="/add-topic" component={WriteTopic} onLeave={triggerLeave} onEnter={requireAuthAdmin} />
    <Route path="/edit-topic/:id" component={EditTopic} onLeave={triggerLeave} onEnter={requireAuthAdmin} />
    <Route path="/all-topic" component={AllTopics} onLeave={triggerLeave} onEnter={requireAuthAdmin} />

    <Route path="/topics" component={Topics} onLeave={triggerLeave} onEnter={triggerEnter} />
    <Route path="/topics/:id" component={TopicsDetail} onLeave={triggerLeave} onEnter={triggerEnter} />

    <Route path="/comment/:id" component={CommentDetail} onLeave={triggerLeave} onEnter={triggerEnter} />
    <Route path="/posts/:id" component={PostsDetaill} onLeave={triggerLeave} onEnter={triggerEnter} />
    <Route path="/write-posts" component={WritePosts} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/write-posts/:id" component={WritePosts} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/edit-posts/:id" component={EditPosts} onLeave={triggerLeave} onEnter={requireAuth} />

    <Route path="/write-comment" component={WriteComment} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/edit-comment/:id" component={EditComment} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/me" component={Me} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/forgot" component={Forgot} onLeave={triggerLeave} onEnter={triggerEnter} />

    <Route path="/people/:id" component={People} onLeave={triggerLeave} onEnter={triggerEnter}>
      <IndexRoute component={PoeplePosts} onLeave={triggerLeave} onEnter={triggerEnter} />
      <Redirect path="posts" to="/people/:id" />
      <Route path="comments" component={PoepleComment} onLeave={triggerLeave} onEnter={triggerEnter} />
      <Route path="topics" component={PoepleTopic} onLeave={triggerLeave} onEnter={triggerEnter} />
      <Route path="following" component={PoepleFollowing} onLeave={triggerLeave} onEnter={triggerEnter} />
      <Route path="fans" component={PoepleFans} onLeave={triggerLeave} onEnter={triggerEnter} />
      <Route path="follow/posts" component={PoepleFollowPosts} onLeave={triggerLeave} onEnter={triggerEnter} />
    </Route>

    <Route path="/improve-profile" component={ImproveProfile} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/settings" component={Settings} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/settings/nickname" component={SettingsNickname} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/settings/gender" component={SettingsGender} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/settings/brief" component={SettingsBrief} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/settings/password" component={SettingsPassword} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/settings/avatar" component={SettingsAvatar} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/settings/email" component={SettingsEmail} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/settings/binding-email" component={BindingEmail} onLeave={triggerLeave} onEnter={requireAuth} />
    
    <Route path="/oauth" component={Oauth} onLeave={triggerLeave} onEnter={triggerEnter} />
    <Route path="/oauth-binding/:source" component={OauthBinding} onLeave={triggerLeave} onEnter={triggerEnter} />

    <Route path="/notice" component={Notice} onLeave={triggerLeave} onEnter={triggerEnter} />

    <Route path="/not-found" component={NotFound} onLeave={triggerLeave} onEnter={triggerEnter} />
    <Route path="/privacy" component={Privacy} onLeave={triggerLeave} onEnter={triggerEnter} />
  </Router>)
}
