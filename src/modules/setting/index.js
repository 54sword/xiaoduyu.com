import React from 'react';

import Avatar from '@components/settings/avatar';
import Brief from '@components/settings/brief';
import Email from '@components/settings/email';
import Gender from '@components/settings/gender';
import Nickname from '@components/settings/nickname';
import Oauth from '@components/settings/oauth';
import Password from '@components/settings/password';
import Phone from '@components/settings/phone';
import Block from '@components/settings/block';

export default class Setting extends React.PureComponent {

  render() {
    return(<div>
      <Avatar />
      <Nickname />
      <Brief />
      <Gender />
      <Password />
      <Phone />
      <Email />
      <Oauth />
      <Block />
    </div>)
  }

}
