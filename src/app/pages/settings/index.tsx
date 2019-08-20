import React from 'react';

// components
import Shell from '@app/modules/shell';
import Meta from '@app/modules/meta';

// modules
import Avatar from '@app/modules/settings/avatar';
import Brief from '@app/modules/settings/brief';
import Email from '@app/modules/settings/email';
import Gender from '@app/modules/settings/gender';
import Nickname from '@app/modules/settings/nickname';
import Oauth from '@app/modules/settings/oauth';
import Password from '@app/modules/settings/password';
import Phone from '@app/modules/settings/phone';
import Block from '@app/modules/settings/block';
import Theme from '@app/modules/settings/theme';
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
      <Theme />
      <Password />
      <Phone />
      <Email />
      <Oauth />
      <Block />
      {/* <ServiceWorker /> */}
    </SingleColumns> 
  )
})
