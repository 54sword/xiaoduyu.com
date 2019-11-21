import sm from 'sitemap';
import fs from 'fs';

import graphql from '@app/redux/utils/graphql';
import { domainName, debug } from '@config';

const createSitemap = function(fileName: string, urls: Array<any>) {
  const sitemap = sm.createSitemap ({ hostname: domainName, cacheTime: 1000 * 60 * 60 * 24, urls });
  const path = process.cwd()+'/public/sitemap/'+fileName;
  if (!debug) {
    console.log(`${path} 创建成功`);
    fs.writeFileSync(path, sitemap.toString());
  } else {
    console.log(`${path} 创建成功（开发环境不生成文件）`);
  }
}

const loadData = async function (pageNumber: number) {

  let err: any,
  data: { posts: Array<any>, topics: Array<any> },
  loadMore = false;

  [ err, data ] = await graphql({
    apis: [{
      api: 'sitemap',
      args: {
        page_number: pageNumber
      },
      fields: `
        posts{
          _id
          update_at
        }
        topics{
          _id
        }
      `
    }]
  });

  if (data && data.posts && data.posts.length > 0) {
    let urls: any = [];

    loadMore = true;

    data.posts.map(item=>{
      let s: any = { url: '/posts/'+item._id,  changefreq: 'daily', priority: 0.8 }
      if (item.update_at) s.lastmodISO = item.update_at; 
      urls.push(s);
    });
    createSitemap(`posts-${pageNumber}.xml`, urls);
  }

  if (data && data.topics && data.topics.length > 0) {
    let urls: any = [];

    loadMore = true;

    data.topics.map(item=>{
      let s: any = { url: '/topic/'+item._id,  changefreq: 'daily', priority: 0.8 }
      if (item.update_at) s.lastmodISO = item.update_at; 
      urls.push(s);
    });
    createSitemap(`topics-${pageNumber}.xml`, urls);
  }

  if (loadMore) {
    setTimeout(()=>{
      loadData(pageNumber+1);
    }, 5000);
  } else {
    console.log('sitemap.xml 全部创建完成');
  }

}

const run = async function() {

  let urls: Array<any> = [
        { url: '/',  changefreq: 'daily', priority: 1.0 },
        { url: '/agreement',  changefreq: 'monthly', priority: 0.1 },
        { url: '/privacy',  changefreq: 'monthly', priority: 0.1 }
      ];

  createSitemap(`index.xml`, urls);

  loadData(1);

}

let start = function(){
  run();
  setTimeout(()=>{
    start();
  }, 1000 * 60 * 60 * 24);
}

start();