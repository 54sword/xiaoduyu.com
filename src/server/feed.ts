import express from 'express';
import { Feed } from "feed";
import cache from './cache';
import graphql from '@app/redux/utils/graphql';
import { name, description, domainName, debug } from '@config';

export default () => {

  const router = express.Router();

  const getFeed = async () => {
    let err: any,
    data: Array<any>;

    [ err, data ] = await graphql({
      apis: [{
        api: 'posts',
        args: {
          page_size: 50,
          deleted: false,
          weaken: false,
          sort_by: 'create_at'
        },
        fields: `
        _id
        title
        content_html
        create_at
        user_id{
          _id
          nickname
        }
        topic_id{
          name
        }
        `
      }]
    });

    const feed = new Feed({
      title: name,
      description: description,
      id: domainName,
      link: domainName,
      image: `${domainName}/favicon.png`,
      favicon: `${domainName}/favicon.png`,
      copyright: `Copyright © 2017-${new Date().getFullYear()}, ${name}`,
      feedLinks: {
        atom: `${domainName}/rss/index.xml`
      }
    });

    data.map((item: any)=>{

      feed.addItem({
        title: item.title,
        id: `${domainName}/posts/${item._id}`,
        link: `${domainName}/posts/${item._id}`,
        // description: item.content_html,
        content: item.content_html,
        author: [
          {
            name: item.user_id.nickname,
            link: `${domainName}/people/${item.user_id._id}`
          }
        ],
        date: new Date(item.create_at),
        published: new Date(item.create_at)
      });

    });

    return feed
  }

  // rss2
  router.get('/', async (req: any, res: any) => {
    const feed = await getFeed();
    res.set('Content-Type', 'application/rss+xml');
    const content = feed.rss2();
    cache.set(req.originalUrl, content);
    res.send(content);
  });
  
  // atom
  router.get('/atom', async (req: any, res: any) => {
    const feed = await getFeed();
    res.set('Content-Type', 'application/rss+xml');
    const content = feed.atom1();
    cache.set(req.originalUrl, content);
    res.send(content);
  });

  return router;

}