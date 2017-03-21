import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { shallow, mount, render } from 'enzyme'
// import { Provider } from 'react-redux'
// import configureStore from '../../../store/configureStore'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import { DateDiff } from '../../../common/date'
import HTMLText from '../../html-text'

import { NotificationList } from '../index'
import styles from '../style.scss'

describe('<NotificationList />', ()=>{

  // 假数据
  const notices = [
    {
        "_id": "58bfb0d5662018842b3ab472",
        "type": "follow-posts",
        "posts_id": {
            "_id": "58bc2337c71c772d190fab24",
            "content_html": "<p><strong>小度鱼（API篇）</strong></p><p></p><p><strong>介绍</strong></p><p></p><p>小度鱼，是基于 React + NodeJS + Express + MongoDB 开发的一个社区系统</p><p>线上站点：<a href=\"https://www.xiaoduyu.com\">https://www.xiaoduyu.com</a></p><p>前端源码地址：<a href=\"https://github.com/54sword/xiaoduyu.com\">https://github.com/54sword/xiaoduyu.com</a></p><p>后端API源码地址：<a href=\"https://github.com/54sword/api.xiaoduyu.com\">https://github.com/54sword/api.xiaoduyu.com</a></p><p></p><p><strong>特点</strong></p><ul><li> 图片分离，图片上传至七牛</li><li>支持 JWT(JSON Web Token)</li><li>支持 SendCloud 发送邮件</li><li>支持邮箱、QQ、微博注册登录</li></ul><p><strong>安装部署</strong></p><p></p><p>不保证 Windows 系统的兼容性</p><p>目前无API文档，建议先配合前端一起使用</p><pre>1. 安装 Node.js[必须] MongoDB[必须]<br>2. git clone git@github.com:54sword/api.xiaoduyu.com.git<br>3. cd api.xiaoduyu.com<br>4. npm install<br>5. cp config.default.js config.js 请根据需要修改 config.js 配置文件<br>6. make run<br>7. 访问 http://localhost:3000<br>8. 完成<br></pre><p></p><p><strong>开源协议</strong></p><p></p><p>MIT</p><p></p>",
            "title": "【后端API篇】基于 React + NodeJS + Express + MongoDB 开发的一个社区系统",
            "type": 1
        },
        "sender_id": {
            "_id": "58b914b4a95835577020ce40",
            "nickname": "金河",
            "avatar": "//img.xiaoduyu.com/58b914b4a95835577020ce40.jpg?imageMogr2/thumbnail/!200",
            "create_at": "2017-03-03T07:01:08.592Z",
            "avatar_url": "//img.xiaoduyu.com/58b914b4a95835577020ce40.jpg?imageMogr2/thumbnail/!50",
            "id": "58b914b4a95835577020ce40"
        },
        "create_at": "2017-03-08T07:20:53.281Z",
        "has_read": true
    },
    {
        "_id": "58beee3b662018842b3ab463",
        "type": "follow-you",
        "sender_id": {
            "_id": "58beecf6662018842b3ab460",
            "nickname": "13763394340",
            "avatar": "",
            "create_at": "2017-03-07T17:25:10.830Z",
            "avatar_url": "//img.xiaoduyu.com/default_avatar.jpg",
            "id": "58beecf6662018842b3ab460"
        },
        "create_at": "2017-03-07T17:30:35.718Z",
        "has_read": true
    },
    {
        "_id": "58be29f6662018842b3ab451",
        "type": "reply",
        "sender_id": {
            "_id": "58be1ae89519723b201c35ce",
            "nickname": "w10036w",
            "avatar": "//img.xiaoduyu.com/FpAEyRXsSV0BU-T5N2EoemhfCiBg?imageMogr2/thumbnail/!200",
            "create_at": "2017-03-07T02:28:56.041Z",
            "avatar_url": "//img.xiaoduyu.com/FpAEyRXsSV0BU-T5N2EoemhfCiBg?imageMogr2/thumbnail/!50",
            "id": "58be1ae89519723b201c35ce"
        },
        "comment_id": {
            "_id": "58be29f6662018842b3ab450",
            "posts_id": {
                "_id": "58be1e0d662018842b3ab43d",
                "title": "邮箱验证需要输入密码，然而OAuth并没有存密码",
                "type": 1
            },
            "parent_id": {
                "_id": "58be2105662018842b3ab442",
                "content_html": "<p>1、邮箱验证需要输入密码，然而OAuth并没有存密码（正确）</p><p>2、这个请求是，定时拉取最新的帖子，然后显示到页面最上面</p>",
                "content_trim": "1、邮箱验证需要输入密码，然而OAuth并没有存密码（正确）2、这个请求是，定时拉取最新的帖子，然后显示到页面最上面"
            },
            "reply_id": {
                "_id": "58be23d7662018842b3ab44a",
                "content_html": "<p>option的问题，这里有相关的解释，<a href=\"https://segmentfault.com/q/1010000003498946\">https://segmentfault.com/q/1010000003498946</a></p>",
                "content_trim": "option的问题，这里有相关的解释，https://segmentfault.com/q/1010000003498946"
            },
            "content_html": "<p>哦对忘了你是跨域了</p><p>可以用代理解决</p><p>例子的话你可以看smallpath.me 的源码</p>",
            "content_trim": "哦对忘了你是跨域了可以用代理解决例子的话你可以看smallpath.me 的源码"
        },
        "create_at": "2017-03-07T03:33:10.708Z",
        "has_read": true
    },
    {
        "_id": "58be1ee5662018842b3ab43f",
        "type": "like-reply",
        "sender_id": {
            "_id": "58be1ae89519723b201c35ce",
            "nickname": "w10036w",
            "avatar": "//img.xiaoduyu.com/FpAEyRXsSV0BU-T5N2EoemhfCiBg?imageMogr2/thumbnail/!200",
            "create_at": "2017-03-07T02:28:56.041Z",
            "avatar_url": "//img.xiaoduyu.com/FpAEyRXsSV0BU-T5N2EoemhfCiBg?imageMogr2/thumbnail/!50",
            "id": "58be1ae89519723b201c35ce"
        },
        "comment_id": {
            "_id": "58bd248d9519723b201c35b6",
            "posts_id": {
                "_id": "58ba7b38d068dc3e713b5c2d",
                "title": "请问下这套程序后台没开源吗?",
                "type": 2
            },
            "parent_id": {
                "_id": "58baaa22d068dc3e713b5c2e",
                "content_html": "<p>预计下周会开源 API 的部分，正在整理和修改中</p>",
                "content_trim": "预计下周会开源 API 的部分，正在整理和修改中"
            },
            "reply_id": {
                "_id": "58bd24059519723b201c35b4",
                "content_html": "<p>已经开源了吗</p>",
                "content_trim": "已经开源了吗"
            },
            "content_html": "<p>已开源</p><p>前端源码地址：<a href=\"https://github.com/54sword/xiaoduyu.com\">https://github.com/54sword/xiaoduyu.com</a>\n</p><p>后端API源码地址：<a href=\"https://github.com/54sword/api.xiaoduyu.com\">https://github.com/54sword/api.xiaoduyu.com</a></p>",
            "content_trim": "已开源前端源码地址：https://github.com/54sword/xiaoduyu.com\n后端API源码地址：https://github.com/54sword/api.xiaoduyu...."
        },
        "create_at": "2017-03-07T02:45:57.319Z",
        "has_read": true
    },
    {
        "_id": "58b935cea95835577020ce45",
        "type": "like-comment",
        "sender_id": {
            "_id": "58b914b4a95835577020ce40",
            "nickname": "金河",
            "avatar": "//img.xiaoduyu.com/58b914b4a95835577020ce40.jpg?imageMogr2/thumbnail/!200",
            "create_at": "2017-03-03T07:01:08.592Z",
            "avatar_url": "//img.xiaoduyu.com/58b914b4a95835577020ce40.jpg?imageMogr2/thumbnail/!50",
            "id": "58b914b4a95835577020ce40"
        },
        "comment_id": {
            "_id": "58b6423de4a8164839c121c3",
            "posts_id": {
                "_id": "58b64034e4a8164839c121c0",
                "title": "ce",
                "type": 2
            },
            "content_html": "<p>这位同学是解除了QQ绑定，然后又重新使用QQ登录了吧？</p><p>之前创建的用户，如果没有设置邮箱，或没有绑定微博的话，就再也登录不了。</p>",
            "content_trim": "这位同学是解除了QQ绑定，然后又重新使用QQ登录了吧？之前创建的用户，如果没有设置邮箱，或没有绑定微博的话，就再也登录不了。"
        },
        "create_at": "2017-03-03T09:22:22.132Z",
        "has_read": true
    },
    {
        "_id": "58b8d6e7745cb83a66761201",
        "type": "comment",
        "sender_id": {
            "_id": "58b8c485745cb83a667611fc",
            "nickname": "TBK",
            "avatar": "//img.xiaoduyu.com/58b8c485745cb83a667611fc.jpg?imageMogr2/thumbnail/!200",
            "create_at": "2017-03-03T01:19:01.105Z",
            "avatar_url": "//img.xiaoduyu.com/58b8c485745cb83a667611fc.jpg?imageMogr2/thumbnail/!50",
            "id": "58b8c485745cb83a667611fc"
        },
        "comment_id": {
            "_id": "58b8d6e7745cb83a66761200",
            "posts_id": {
                "_id": "58a709c3d76d49244d9f6e92",
                "title": "发布帖子测试",
                "type": 2
            },
            "content_html": "<p>地方大幅度发</p>",
            "content_trim": "地方大幅度发"
        },
        "create_at": "2017-03-03T02:37:27.389Z",
        "has_read": true
    },
    {
        "_id": "58b5372be4a8164839c12192",
        "sender_id": {
            "_id": "58b53680e4a8164839c12181",
            "nickname": "阿海绵阿宝宝",
            "avatar": "//img.xiaoduyu.com/58b53680e4a8164839c12181.jpg?imageMogr2/thumbnail/!200",
            "create_at": "2017-02-28T08:36:16.159Z",
            "avatar_url": "//img.xiaoduyu.com/58b53680e4a8164839c12181.jpg?imageMogr2/thumbnail/!50",
            "id": "58b53680e4a8164839c12181"
        },
        "comment_id": {
            "_id": "58b53714e4a8164839c1218f",
            "posts_id": {
                "_id": "58b52ab6e4a8164839c1217c",
                "title": "体验下",
                "type": 2
            },
            "content_html": "<p>啦啦啦  发帖子哪去了</p>",
            "content_trim": "啦啦啦  发帖子哪去了"
        },
        "type": "new-comment",
        "create_at": "2017-02-28T08:38:44.522Z",
        "has_read": true
    }
  ]

  const props = {
    name: 'index',
    filters: {},
    notification: {
      data: notices
    },
    loadNotifications: ()=>{}
  }

  // let wrapper = mount(<Provider store={store}><NotificationList {...props} /></Provider>)
  let wrapper = shallow(<NotificationList {...props} />)

  it('应该能找到7个 `.header`', function() {
    expect(wrapper.find('.header').length).toBe(7);
  })

  it('应该包含 follow-posts', function() {

    let notice = notices[0]
    let avatar = <i className="load-demand" data-load-demand={`<img class=${styles.avatar} src=${notice.sender_id.avatar_url} />`}></i>

    expect(wrapper.contains(<div>
        <div className={styles.header}>
          <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
          {DateDiff(notice.create_at)} 关注了你的
          <Link to={`/posts/${notice.posts_id._id}`}>{notice.posts_id.title}</Link>
          {notice.posts_id.type == 1 ?  '分享' : '提问'}
        </div>
      </div>)).toBe(true);
  })

  it('应该包含 follow-you', function() {

    let notice = notices[1]
    let avatar = <i className="load-demand" data-load-demand={`<img class=${styles.avatar} src=${notice.sender_id.avatar_url} />`}></i>

    expect(wrapper.contains(<div>
        <div className={styles.header}>
          <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
          {DateDiff(notice.create_at)} 关注了你
        </div>
      </div>)).toBe(true);
  })

  it('应该包含 reply', function() {

    let notice = notices[2]
    let avatar = <i className="load-demand" data-load-demand={`<img class=${styles.avatar} src=${notice.sender_id.avatar_url} />`}></i>

    expect(wrapper.contains(<div>
      <div className={styles.header}>
        <div className={styles.actions}>
          <Link to={`/write-comment?posts_id=${notice.comment_id.posts_id._id}&parent_id=${notice.comment_id.parent_id._id}&reply_id=${notice.comment_id._id}`}>回复</Link>
        </div>
        <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
        {DateDiff(notice.create_at)} 回复了你的
        <Link to={`/comment/${notice.comment_id.parent_id._id}`}>
          {notice.comment_id.reply_id ? notice.comment_id.reply_id.content_trim : notice.comment_id.parent_id.content_trim}
        </Link>
        {notice.comment_id.reply_id ? '回复' : '评论'}
      </div>
      <div className={styles.content}>
        <HTMLText content={notice.comment_id.content_html} />
      </div>
    </div>)).toBe(true);
  })

  it('应该包含 like-reply', function() {

    let notice = notices[3]
    let avatar = <i className="load-demand" data-load-demand={`<img class=${styles.avatar} src=${notice.sender_id.avatar_url} />`}></i>

    expect(wrapper.contains(<div>
      <div className={styles.header}>
        <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
        {DateDiff(notice.create_at)} 赞了你的
        <Link to={`/comment/${notice.comment_id.parent_id._id}`}>{notice.comment_id.content_trim}</Link>
        回复
      </div>
    </div>)).toBe(true);
  })

  it('应该包含 like-comment', function() {

    let notice = notices[4]
    let avatar = <i className="load-demand" data-load-demand={`<img class=${styles.avatar} src=${notice.sender_id.avatar_url} />`}></i>

    expect(wrapper.contains(<div>
      <div className={styles.header}>
        <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
        {DateDiff(notice.create_at)} 赞了你的
        <Link to={`/comment/${notice.comment_id._id}`}>{notice.comment_id.content_trim}</Link>
        评论
      </div>
    </div>)).toBe(true);
  })

  it('应该包含 comment', function() {

    let notice = notices[5]
    let avatar = <i className="load-demand" data-load-demand={`<img class=${styles.avatar} src=${notice.sender_id.avatar_url} />`}></i>

    expect(wrapper.contains(<div>
      <div className={styles.header}>
        <div className={styles.actions}>
          <Link to={`/write-comment?posts_id=${notice.comment_id.posts_id._id}&parent_id=${notice.comment_id._id}`}>回复</Link>
        </div>
        <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
        {DateDiff(notice.create_at)} 评论了你的
        <Link to={`/posts/${notice.comment_id.posts_id._id}`}>{notice.comment_id.posts_id.title}</Link>
        {notice.comment_id.posts_id.type == 1 ?  '分享' : '提问'}
      </div>
      <div className={styles.content}>
        <HTMLText content={notice.comment_id.content_html} />
      </div>
    </div>)).toBe(true);
  })

  it('应该包含 new-comment', function() {

    let notice = notices[6]
    let avatar = <i className="load-demand" data-load-demand={`<img class=${styles.avatar} src=${notice.sender_id.avatar_url} />`}></i>

    expect(wrapper.contains(<div>
      <div className={styles.header}>
        <Link to={`/people/${notice.sender_id._id}`}>{avatar}{notice.sender_id.nickname}</Link>
        {DateDiff(notice.create_at)} 评论了
        <Link to={`/posts/${notice.comment_id.posts_id._id}`}>{notice.comment_id.posts_id.title}</Link>
        {notice.comment_id.posts_id.type == 1 ?  '分享' : '提问'}
      </div>
      <div className={styles.content}>
        <Link to={`/comment/${notice.comment_id._id}`}>{notice.comment_id.content_trim}</Link>
      </div>
    </div>)).toBe(true);
  })

})
