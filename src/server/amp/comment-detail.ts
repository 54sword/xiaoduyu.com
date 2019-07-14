import cache from 'memory-cache';
import { name, domainName, AMP, favicon, googleAdSense } from '@config';
import featureConfig from '@config/feature.config';

// tools
import { abstractImagesFromHTML } from '@utils/utils';
import graphql from '@utils/graphql';
import { dateDiff } from '@utils/date';

export const show = async (req: any, res: any) => {

  const { id } = req.params;
  
  let [ err, comment ] = await graphql({
    apis: [{
      api: 'comments',
      args: {
        _id: id,
        deleted: false,
        weaken: false
      },
      fields: `
        posts_id{
          _id
          title
          content_html
        }
        content_html
        create_at
        reply_count
        like_count
        _id
        user_id {
          _id
          nickname
          avatar_url
        }
      `
    }]
  });

  if (comment && comment[0]) {
    comment = comment[0];
  } else {
    res.status(404);
    res.send('404 Not Found');
    return
  }

  comment = JSON.parse(JSON.stringify(comment));

  // ================
  // 获取内容中的所有图片
  comment.images = abstractImagesFromHTML(comment.content_html);

  // ================
  // 生产描述
  comment.description = comment.content_html || '';

  // 删除所有html标签
  comment.description = comment.description.replace(/<[^>]+>/g,"");

  if (comment.description.length > 100) comment.description = comment.description.slice(0, 100)+'...';
  comment.description = `${comment.user_id.nickname}的评论: ${comment.description}`;


  // 删除所有html标签
  comment.posts_id.content_html = comment.posts_id.content_html.replace(/<[^>]+>/g,"");

  if (comment.posts_id.content_html.length > 100) comment.posts_id.content_html = comment.posts_id.content_html.slice(0, 100)+'...';

  // ==============
  // img 转换成 amp-img
  let arr = comment.content_html.match(/<img.*?(?:>|\/>)/gi);
  if (arr && arr.length > 0) {
    arr.map((item: any)=>{
      let arr = item.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i);
      if (arr && arr[1]) {
        comment.content_html = comment.content_html.replace(item, `<amp-img width="16" height="9" layout="responsive" src="${arr[1]}"></amp-img>`)
      }
    });
  }

  // ==============
  // 删除所有的style
  comment.content_html = comment.content_html.replace(/style\s*=(['\"\s]?)[^'\"]*?\1/gi,'');
  comment.content_html = comment.content_html.replace(/style/gi, '');
  comment._create_at = dateDiff(comment.create_at);


  // =============================
  // 获取评论
  let [ error, commentList ] = await graphql({
    apis: [{
      api: 'comments',
      args: {
        // posts_id: comment.posts_id._id,
        parent_id: comment._id,
        page_size: 50,
        weaken: false
      },
      fields: `
        content_html
        create_at
        reply_count
        like_count
        _id
        user_id {
          _id
          nickname
          avatar_url
        }
      `
    }]
  });

  commentList = JSON.parse(JSON.stringify(commentList));

  if (commentList.length > 0) {

    commentList.map((comment: any)=>{

      comment._create_at = dateDiff(comment.create_at);

      if (comment.content_html) {
        // ==============
        // img 转换成 amp-img
        let arr = comment.content_html.match(/<img.*?(?:>|\/>)/gi);
        if (arr && arr.length > 0) {
          arr.map((item: any)=>{
            let arr = item.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i);
            if (arr && arr[1]) {
              comment.content_html = comment.content_html.replace(item, `<amp-img width="16" height="9" layout="responsive" src="${arr[1]}"></amp-img>`)
            }
          });
        }
      }

    });

  }

  res.render('../dist/server/views/pages/comment-detail.ejs', {
    AMP,
    website_name: name,
    domainName,
    comment,
    commentList,
    favicon,
    googleAdSense
  }, function(err: any, html: any) {
    cache.put(req.url, html, featureConfig.cache);
    res.send(html);
  });

}
