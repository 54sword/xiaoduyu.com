import express from 'express';
import * as postsDetail from './posts-detail';

export default () => {
  const router = express.Router();
  router.get('/posts/:id', postsDetail.show);
  return router;
}
