
import express from 'express';
import { authCookieName } from '@config';

// (安全实施) 服务端储存 token cookie 设置成httpOnly
export default () => {

  const router = express.Router();
  
  router.post('/in', (req, res)=>{
    let access_token = req.body.access_token;
    res.cookie(authCookieName, access_token, { path: '/', httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 });    
    res.send({ success: true });
  });
  
  router.post('/out', (req, res)=>{
    res.clearCookie(authCookieName);
    res.send({ success: true });
  });

  return router
}
