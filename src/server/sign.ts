import express from 'express';
import { authCookieName } from '@config';
import feature from '@config/feature.config';

import { loadUserInfo } from '@app/redux/actions/user';

// (安全实施) 服务端储存 token cookie 设置成httpOnly
export default (): object => {
  
  const router = express.Router();
  
  router.post('/in', (req: any, res: any) => {
    let access_token = req.body.access_token;
    res.cookie(authCookieName, access_token, { path: '/', httpOnly: true, maxAge: feature.tokenMaxAge });    
    res.send({ success: true });
  });
  
  router.post('/out', (req: any, res: any) => {
    res.clearCookie(authCookieName);
    res.send({ success: true });
  });

  // 检查是否登录，以及token是否有效
  router.post('/check', async (req: any, res: any) => {

    let accessToken = req.cookies[authCookieName] || '';

    let result: any = {
      success: true,
      signIn: false,
      error: null,
      accessToken
    }

    if (accessToken) {
      let [ err, res ] = await loadUserInfo({ accessToken })(null, null);
      if (res) {
        result.signIn = true;
        result.userInfo = res;

      } else {
        result.error = err;
      }
    }

    res.send(result);
  });

  return router;
}
