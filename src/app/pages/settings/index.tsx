import React from 'react';

// components
import Shell from '@app/components/shell';
import Meta from '@app/components/meta';

// modules
import Avatar from './components/avatar';
import Brief from './components/brief';
import Email from './components/email';
import Gender from './components/gender';
import Nickname from './components/nickname';
import Oauth from './components/oauth';
import Password from './components/password';
import Phone from './components/phone';
import Block from './components/block';
import Theme from './components/theme';
import UserCover from './components/user-cover';
// import ServiceWorker from '@app/modules/settings/service-worker';

// layout
import SingleColumns from '../../layout/single-columns';

export default Shell(function() {

  return (
    <SingleColumns>  
      <Meta title='设置' />
      <Avatar />
      <Nickname />
      <Brief />
      <Gender />
      <Password />
      <Phone />
      <Email />
      <Oauth />
      <Block />
      <Theme />
      <UserCover />
      {/* <ServiceWorker /> */}
    </SingleColumns> 
  )
})
