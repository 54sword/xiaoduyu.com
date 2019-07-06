import { name, domainName, AMP, favicon, googleAdSense } from '@config';

// tools
import { abstractImagesFromHTML } from '@utils/utils';
import graphql from '@utils/graphql';
import { dateDiff } from '@utils/date';

export const show = async (req: any, res: any) => {

  const { id } = req.params;
  
  let [ err, posts ] = await graphql({
    apis: [{
      api: 'posts',
      args: { _id: id },
      fields: `
        _id
        comment_count
        content_html
        create_at
        follow_count
        like_count
        title
        topic_id{
          _id
          name
        }
        user_id{
          _id
          nickname
          brief
          avatar_url
        }
        view_count
      `
    }]
  });

  if (posts && posts[0]) {
    posts = posts[0];
  } else {
    res.send('404 Not Found');
    return
  }

  posts = JSON.parse(JSON.stringify(posts));

  // ================
  // 获取内容中的所有图片
  posts.images = abstractImagesFromHTML(posts.content_html);

  // ================
  // 生产描述
  posts.description = posts.content_html || '';

  // 删除所有html标签
  posts.description = posts.description.replace(/<[^>]+>/g,"");

  if (posts.description.length > 100) posts.description = posts.description.slice(0, 100)+'...';
  posts.description = `${posts.topic_id.name} - ${posts.user_id.nickname} - ${posts.description}`;

  // ==============
  // img 转换成 amp-img
  let arr = posts.content_html.match(/<img.*?(?:>|\/>)/gi);
  if (arr && arr.length > 0) {
    arr.map((item: any)=>{
      let arr = item.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i);
      if (arr && arr[1]) {
        posts.content_html = posts.content_html.replace(item, `<amp-img width="16" height="9" layout="responsive" src="${arr[1]}"></amp-img>`)
      }
    });
  }

  // ==============
  // 删除所有的style
  posts.content_html = posts.content_html.replace(/style\s*=(['\"\s]?)[^'\"]*?\1/gi,'');
  posts.content_html = posts.content_html.replace(/style/gi, '');
  posts._create_at = dateDiff(posts.create_at);

  // =============================
  // 获取评论
  let [ error, commentList ] = await graphql({
    apis: [{
      api: 'comments',
      args: {
        posts_id: id,
        parent_id: 'not-exists',
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

  res.render('../dist/server/views/pages/posts-detail.ejs', {
    AMP,
    website_name: name,
    domainName,
    posts,
    commentList,
    favicon,
    googleAdSense
  });

}
