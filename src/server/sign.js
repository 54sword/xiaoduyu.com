
import express from 'express';
import { auth_cookie_name } from '../../config';

// (安全实施) 服务端储存 token cookie 设置成httpOnly
export default () => {

  const router = express.Router();

  router.post('/in', (req, res)=>{
    let access_token = req.body.access_token;
    res.cookie(auth_cookie_name, access_token, { path: '/', httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 });
    res.send({ success: true });
  });
  
  router.post('/out', (req, res)=>{
    res.clearCookie(auth_cookie_name);
    res.send({ success: true });
  });

  return router
}
