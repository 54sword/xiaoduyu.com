import React from 'react';
import { Route, Router, Redirect, IndexRoute } from 'react-router';

import Home from './containers/home/';
import Communities from './containers/nodes'
import CommunitiesDetail from './containers/node-detail'
import WriteNode from './containers/write-node'
import EditNode from './containers/edit-node'
import AllNode from './containers/all-node'
import Notifications from './containers/notifications'

import Forgot from './containers/forgot'

import Me from './containers/me'
import Settings from './containers/settings'
import SettingsNickname from './containers/reset-nickname'
import SettingsGender from './containers/reset-gender'
import SettingsBrief from './containers/reset-brief'
import SettingsPassword from './containers/reset-password'
import SettingsAvatar from './containers/reset-avatar'
import SettingsEmail from './containers/reset-email'
import BindingEmail from './containers/binding-email'

import NotFound from './containers/not-found'
import QuestionDetail from './containers/question-detail'

import Answer from './containers/answer'

import WriteQuestion from './containers/write-question'
import EditQuestion from './containers/edit-question'
import WriteAnswer from './containers/write-answer'
import EditAnswer from './containers/edit-answer'
import WriteComment from './containers/write-comment'
import EditComment from './containers/edit-comment'

import People from './containers/people'
import PoepleAsks from './containers/people/components/asks'
import PoepleAnswers from './containers/people/components/answers'
import PoepleCommunities from './containers/people/components/communities'
import PoepleFollowing from './containers/people/components/following'
import PoepleFans from './containers/people/components/fans'

import Oauth from './containers/oauth'
import OauthBinding from './containers/oauth-binding'

import Notice from './containers/notice'


export default (history, user, logPageView = ()=>{}) =>{

  // 验证是否登录
  const requireAuth = (nextState, replaceState) => {

    if (!user) {
      replaceState({
        pathname: '/',
        query: {},
        state: { nextPathname: nextState.location.pathname }
      })
      return
    }

    triggerEnter(nextState, replaceState)
  }

  const adminRequireAuth = (nextState, replaceState) => {

    if (!user || user.role !== 100) {
      replaceState({
        pathname: '/',
        query: {},
        state: { nextPathname: nextState.location.pathname }
      })
      return
    }

    triggerEnter(nextState, replaceState)
  }


  const triggerEnter = (nextState, replaceState) => {
    // console.log(nextState)
  }

  const triggerLeave = (nextState, replaceState) => {
  }

  // <Route path="*" component={NotFound} />
  return (<Router history={history} onUpdate={logPageView}>
    <Route path="/" component={Home} onLeave={triggerLeave} onEnter={triggerEnter} />
    <Route path="/notifications" component={Notifications} onLeave={triggerLeave} onEnter={triggerEnter} />

    <Route path="/add-communitie" component={WriteNode} onLeave={triggerLeave} onEnter={adminRequireAuth} />
    <Route path="/edit-communitie/:id" component={EditNode} onLeave={triggerLeave} onEnter={adminRequireAuth} />
    <Route path="/all-communitie" component={AllNode} onLeave={triggerLeave} onEnter={adminRequireAuth} />

    <Route path="/communities" component={Communities} onLeave={triggerLeave} onEnter={triggerEnter} />
    <Route path="/communities/:id" component={CommunitiesDetail} onLeave={triggerLeave} onEnter={triggerEnter} />
    <Route path="/comment/:id" component={Answer} onLeave={triggerLeave} onEnter={triggerEnter} />
    <Route path="/topic/:id" component={QuestionDetail} onLeave={triggerLeave} onEnter={triggerEnter} />
    <Route path="/write-question/:nodeId" component={WriteQuestion} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/edit-question/:id" component={EditQuestion} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/write-answer/:questionId" component={WriteAnswer} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/edit-answer/:id" component={EditAnswer} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/write-comment/:answerId" component={WriteComment} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/edit-comment/:id" component={EditComment} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/me" component={Me} onLeave={triggerLeave} onEnter={requireAuth} />
    <Route path="/forgot" component={Forgot} onLeave={triggerLeave} onEnter={triggerEnter} />

    <Route path="/people/:id" component={People} onLeave={triggerLeave} onEnter={triggerEnter}>
      <IndexRoute component={PoepleAsks} onLeave={triggerLeave} onEnter={triggerEnter} />
      <Redirect path="asks" to="/people/:id" />
      <Route path="answers" component={PoepleAnswers} onLeave={triggerLeave} onEnter={triggerEnter} />
      <Route path="communities" component={PoepleCommunities} onLeave={triggerLeave} onEnter={triggerEnter} />
      <Route path="following" component={PoepleFollowing} onLeave={triggerLeave} onEnter={triggerEnter} />
      <Route path="fans" component={PoepleFans} onLeave={triggerLeave} onEnter={triggerEnter} />
    </Route>

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
  </Router>)
}
