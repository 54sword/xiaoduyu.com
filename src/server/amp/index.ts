import express from 'express';
import * as postsDetail from './posts-detail';
import * as commentDetail from './comment-detail';

export default () => {
  const router = express.Router();
  router.get('/posts/:id', postsDetail.show);
  router.get('/comment/:id', commentDetail.show);
  return router;
}
