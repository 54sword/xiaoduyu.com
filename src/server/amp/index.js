
import express from 'express';
import postsDetail from './posts-detail';

module.exports = () => {
  const router = express.Router();
  router.get('/posts/:id', postsDetail.show);
  return router;
}
