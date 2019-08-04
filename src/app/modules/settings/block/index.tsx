import React from 'react';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { getUserInfo } from '@reducers/user';

export default function() {

    const me = useSelector((state:object)=>getUserInfo(state));
    
    return (
        <div className="card">
            <div className="card-head pb-0"><div className="title">屏蔽管理</div></div>
            <div className="card-body">
                <div><Link to="/block/posts">屏蔽{me.block_posts_count}个帖子</Link></div>
                <div><Link to="/block/peoples">屏蔽{me.block_people_count}个用户</Link></div>
                <div><Link to="/block/comments">屏蔽{me.block_comment_count}条评论</Link></div>
            </div>
        </div>
    )
}