import express from 'express';
import { authCookieName } from '@config';
import feature from '@config/feature.config';

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

  return router;
}
